
/**
 * List of errors the API can returns
 */
export enum ErrorCode {
  accessUnauthorized = 'access_unauthorized',
  invalidCredentials = 'invalid_credentials',
  localeNotFound = 'locale_not_found',
  projectNotFound = 'project_not_found',
  routeNotFound = 'route_not_found',
  sdkRequiresPublishedCommit = 'sdk_requires_published_commit',
  serverError = 'server_error',
}
