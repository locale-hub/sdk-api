import Joi from 'joi';

export const getManifestSchema = Joi.object({
  locale: Joi
    .string()
    .required(),
  hash: Joi
    .string()
    .optional(),
}).options({
  abortEarly: false,
  allowUnknown: false,
});
