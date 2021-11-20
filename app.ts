import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import projectRoutes from './controllers/project.controller';
import {config} from './configs/config';
import {slowDown, SlowDownConfig} from './logic/middlewares/slowDown.middleware';
import {validateSdkConfig} from './logic/middlewares/validateSdkConfig.middleware';
import {sendError} from './logic/helpers/sendError.helper';
import {ErrorCode} from './data/enums/error-code.enum';
import {ApiException} from './data/exceptions/api.exception';

const expressApp = express();

if (config.features.sentry) {
  Sentry.init({
    dsn: config.sentry.uri,
    environment: config.app.environment,
    release: config.app.version,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({tracing: true}),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({app: expressApp}),
    ],
    tracesSampleRate: 1.0,
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  expressApp.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  expressApp.use(Sentry.Handlers.tracingHandler());

  // API is behind a proxy on PRD
  expressApp.enable('trust proxy');
}

expressApp.use(express.json());
expressApp.use(cors()); // Allow all
expressApp.use(helmet());

expressApp.get('/v1', (req: express.Request, res: express.Response) => res.json({
  status: 'ok',
  api: 'sdk',
  version: config.app.version,
}));

expressApp.use(
  '/v1/projects/:projectId',
  validateSdkConfig,
  projectRoutes,
);

expressApp.use(slowDown(SlowDownConfig.fallback404), (req: express.Request, res: express.Response) => {
  return sendError(res, new ApiException({
    statusCode: 404,
    code: ErrorCode.routeNotFound,
    message: 'Route not found',
  }));
});

if (config.features.sentry) {
  // The error handler must be before any other error middleware and after all controllers
  expressApp.use(Sentry.Handlers.errorHandler());
}

expressApp.use((err: Error, req: express.Request, res: express.Response, _next: unknown) => {
  return sendError(res, err);
});

export const app = expressApp;
