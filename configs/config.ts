
export const config = {
  features: { // features to be enabled or not
    sentry: 'true' === process.env.LH_FEATURES_SENTRY ?? false,
  },
  app: {
    environment: process.env.LH_APP_ENVIRONMENT ?? 'development',
    version: '2.0.0',
    port: 3002, // configurable via docker exposed port
  },
  redis: {
    uri: process.env.LH_REDIS_URI ?? 'redis://host.docker.internal:6379/0',
  },
  sentry: { // if features.sentry = true
    uri: process.env.LH_SENTRY_URI,
  },
};
