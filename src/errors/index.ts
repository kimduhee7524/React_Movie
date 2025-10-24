export * from './classes/ApiError';
export * from './classes/NetworkError';
export * from './classes/ClientError';
export * from './classes/UnknownError';

export * from './types/errorCodes';
export * from './types/BaseError';
export * from './types/errorKinds';

export {
  ErrorBoundary,
  type ErrorBoundaryProps,
} from './boundaries/ErrorBoundary';

export { useErrorHandler } from './hooks/useErrorHandler';

export {
  useHandledQuery,
  useHandledSuspenseQuery,
} from './hooks/useHandledQuery';

export { normalizeError } from './errorNormalize';

export { reportError } from './reporting/errorReport';

export {
  setupGlobalErrorHandlers,
  handleError,
  handleReactError,
} from './errorHandlers';

export { initializeSentry } from './reporting/sentry';

export {
  getErrorContent,
  getErrorContentByKind,
  type ErrorContent,
} from './errorUI';

export { classifyError } from './errorClassify';
