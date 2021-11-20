import expressSlowDown from 'express-slow-down';
import {RequestHandler, Request, Response} from 'express';

// List of slowDown.Options

const slowDownOptions_none: expressSlowDown.Options = {
  skip: (_req: Request, _res: Response): boolean => true,
};

const slowDownOptions_fallback404: expressSlowDown.Options = {
  windowMs: 604800000, // 7 days
  delayAfter: 1, // slow after 1st request
  delayMs: 1000, // Add 1sec delay for each additional request
};

// ####
// # slowDown middleware code
// ####

export enum SlowDownConfig {
  none,
  fallback404,
}


const getConfig = (slowDownConfig: SlowDownConfig): expressSlowDown.Options => {
  switch (slowDownConfig) {
  case SlowDownConfig.fallback404:
    return slowDownOptions_fallback404;
  case SlowDownConfig.none:
  default:
    return slowDownOptions_none;
  }
};

export const slowDown = (slowDownConfig: SlowDownConfig): RequestHandler => {
  const config = getConfig(slowDownConfig);
  return expressSlowDown(config);
};

