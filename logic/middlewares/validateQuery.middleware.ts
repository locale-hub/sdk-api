import {NextFunction, Request, Response} from 'express';
import Joi from 'joi';

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const validation = await schema.validate(req.query);

    if (undefined !== validation.error) {
      const errors = validation.error.details.map((error) => error.message);
      res.status(400).json({
        message: 'Invalid request',
        errors: errors,
      });
      return;
    }

    next();
  };
};
