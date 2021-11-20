import {Response} from 'express';
import * as Sentry from '@sentry/node';

import {ApiError} from '../../data/models/api-error.model';
import {ErrorCode} from '../../data/enums/error-code.enum';
import {ApiException} from '../../data/exceptions/api.exception';
import {config} from '../../configs/config';

const sentryIgnoredStatusCodes = [
  401, 403, 404,
];

const formatError = (exception: ApiException | Error): ApiError => {
  if (exception instanceof ApiException) {
    return exception.error;
  }

  return {
    code: ErrorCode.serverError,
    message: 'Something went wrong',
    statusCode: 500,
  };
};

/**
 * Send a normalized error response
 * @param {Response} res Express Response object
 * @param {ApiException | Error} exception An error that contains all elements for normalized response
 */
export const sendError = (res: Response, exception: ApiException | Error): void => {
  console.error(exception);

  const error = formatError(exception);
  const ignoreErrorTracking = sentryIgnoredStatusCodes.includes(error.statusCode);

  if (config.features.sentry && !ignoreErrorTracking) {
    Sentry.captureException(exception);
  }

  res.status(error.statusCode).json({
    error,
  });
};
