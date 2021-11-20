# Locale Hub SDK API

This SDK allows you to get your translations directly into you app.
We might have developed an SDK to facilitate your integration.
So please check our website as well. 

## Build Docker Image
```shell
docker build -t locale-hub/sdk-api:2.0.0 .
```

## Run Docker Image
```shell
docker run --rm -p 3002:3002 [--env-file .env] --name locale-hub-sdk locale-hub/sdk-api:2.0.0
```

dotenv options
- **LH_FEATURES_SENTRY**: (boolean) Should Sentry be enabled? default: `false`

- **LH_APP_ENVIRONMENT**: (string) Environment name. default `development`
- **LH_REDIS_URI**: (string) Redis uri. default `redis://host.docker.internal:6379/0`
- **LH_SENTRY_URI**: (string) Mandatory if feature enabled, Sentry uri

