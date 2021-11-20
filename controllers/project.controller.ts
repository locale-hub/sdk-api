import {Request, Response, Router as createRouter} from 'express';

import {getManifestSchema} from '../data/requests/getManifest.request';
import {validateQuery} from '../logic/middlewares/validateQuery.middleware';
import {SdkPublishedManifest} from '../data/models/sdkPublishedManifest.model';
import {sendError} from '../logic/helpers/sendError.helper';
import {ApiException} from '../data/exceptions/api.exception';
import {ErrorCode} from '../data/enums/error-code.enum';

const router = createRouter({mergeParams: true});

const defaultSDKCacheTTLInSeconds = 5 * 60; // 5 minutes

router.get('/config', async function(req: Request, res: Response) {
  const publishedManifest: SdkPublishedManifest = req.sdkPublishedManifest;

  res.json({
    config: {
      cacheTTL: defaultSDKCacheTTLInSeconds,
      defaultLocale: publishedManifest.defaultLocale,
    },
  });
});

router.get('/locales', async function(req: Request, res: Response) {
  const publishedManifest: SdkPublishedManifest = req.sdkPublishedManifest;

  res.json({
    locales: publishedManifest.commit.locales,
  });
});

router.get('/manifests', validateQuery(getManifestSchema), async function(req: Request, res: Response) {
  const publishedManifest: SdkPublishedManifest = req.sdkPublishedManifest;
  const locale: string = req.query.locale as string;
  const hash: string = req.query.hash as string;
  const latestCommitId = publishedManifest.commitId;
  const all = publishedManifest.commit.manifest;

  if (undefined !== hash && null !== hash && null !== latestCommitId && latestCommitId === hash) {
    res.status(304).send();
    return;
  }

  if (undefined === all[locale] && undefined === all[publishedManifest.defaultLocale]) {
    return sendError(res, new ApiException({
      statusCode: 404,
      code: ErrorCode.localeNotFound,
      message: 'Invalid locale provided and defaultLocale does not have any entries',
    }));
  }

  res.json({
    manifest: all[locale] ?? all[publishedManifest.defaultLocale],
    metadata: {
      hash: latestCommitId,
    },
  });
});


export default router;
