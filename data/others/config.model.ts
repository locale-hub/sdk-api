import Joi from 'joi';

export const configSchema = Joi.object({
  features: Joi.object({
    sentry: Joi.boolean().required(),
  }).required(),

  app: Joi.object({
    environment: Joi.valid('production', 'development').required(),
    version: Joi.string().required(),
    port: Joi.number().required(),
  }).required(),

  redis: Joi.object({
    uri: Joi.string().required(),
  }).required(),

  sentry: Joi.object({
    uri: Joi.string().optional(),
  }).optional(),
}).unknown();
