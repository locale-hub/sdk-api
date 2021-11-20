import {NextFunction, Request, Response} from 'express';
import {sendError} from '../helpers/sendError.helper';
import {ApiException} from '../../data/exceptions/api.exception';
import {ErrorCode} from '../../data/enums/error-code.enum';
import {redisGet} from '../services/cache-redis.service';
import {SdkPublishedManifest} from '../../data/models/sdkPublishedManifest.model';

export const validateSdkConfig = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (undefined === req.headers['subscription-key']) {
    return sendError(res, new ApiException({
      statusCode: 401,
      code: ErrorCode.accessUnauthorized,
      message: 'Missing required subscription-key header',
    }));
  }

  const projectId: string = req.params.projectId;
  const subscriptionKey: string = req.headers['subscription-key'] as string;

  // Validate projectId / subscriptionKey combination
  const publishedManifest = await redisGet<Partial<SdkPublishedManifest>>(projectId);

  console.log(publishedManifest);
  if (null === publishedManifest) {
    return sendError(res, new ApiException({
      statusCode: 404,
      code: ErrorCode.projectNotFound,
      message: 'Project not found',
    }));
  }

  if (undefined === publishedManifest.subscriptionKeys ||
    !publishedManifest.subscriptionKeys.includes(subscriptionKey)
  ) {
    return sendError(res, new ApiException({
      statusCode: 401,
      code: ErrorCode.invalidCredentials,
      message: 'Unauthorized',
    }));
  }

  if (undefined === publishedManifest.commitId || undefined === publishedManifest.commit) {
    return sendError(res, new ApiException({
      statusCode: 401,
      code: ErrorCode.sdkRequiresPublishedCommit,
      message: 'You need to publish a commit to get access to SDK API',
    }));
  }

  req.sdkPublishedManifest = publishedManifest;
  next();
};
