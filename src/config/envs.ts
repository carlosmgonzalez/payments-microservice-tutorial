import 'dotenv/config';
import * as joi from 'joi';

interface Envs {
  PORT: number;
  STRIPE_SECRET_KEY: string;
  STRIPE_SIGNING_SECRET: string;
  SUCCESS_URL: string;
  CANCEL_URL: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    STRIPE_SECRET_KEY: joi.string().required(),
    STRIPE_SIGNING_SECRET: joi.string().required(),
    SUCCESS_URL: joi.string().required(),
    CANCEL_URL: joi.string().required(),
  })
  .unknown();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const {
  PORT,
  STRIPE_SECRET_KEY,
  STRIPE_SIGNING_SECRET,
  SUCCESS_URL,
  CANCEL_URL,
} = value as Envs;

export const envs = {
  port: PORT,
  stripeSecretKey: STRIPE_SECRET_KEY,
  stripeSigningSecret: STRIPE_SIGNING_SECRET,
  successUrl: SUCCESS_URL,
  cancelUrl: CANCEL_URL,
};
