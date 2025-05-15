import 'dotenv/config';
import * as joi from 'joi';

interface Envs {
  PORT: number;
  STRIPE_SECRET_KEY: string;
  STRIPE_SIGNING_SECRET: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
  NATS_SERVERS: string[];
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    STRIPE_SIGNING_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS!.split(','),
});

if (error) throw new Error(`Config validation error: ${error.message}`);

const {
  PORT,
  STRIPE_SECRET_KEY,
  STRIPE_SIGNING_SECRET,
  STRIPE_SUCCESS_URL,
  STRIPE_CANCEL_URL,
  NATS_SERVERS,
} = value as Envs;

export const envs = {
  port: PORT,
  stripeSecretKey: STRIPE_SECRET_KEY,
  stripeSigningSecret: STRIPE_SIGNING_SECRET,
  successUrl: STRIPE_SUCCESS_URL,
  cancelUrl: STRIPE_CANCEL_URL,
  nastServers: NATS_SERVERS,
};
