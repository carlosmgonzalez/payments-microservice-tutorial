import 'dotenv/config';
import * as joi from 'joi';

interface Envs {
  PORT: number;
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const { PORT } = value as Envs;

export const envs = {
  port: PORT,
};
