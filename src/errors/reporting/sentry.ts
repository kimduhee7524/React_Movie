// TODO: Sentry 설치 후 구현
import { BaseError } from '../types/BaseError';

let isSentryInitialized = false;

export const initializeSentry = (
  dsn: string,
  options?: Record<string, unknown>
) => {
  console.log('[Sentry] Initialized (placeholder)', dsn, options);
  isSentryInitialized = true;
};

export const reportToSentry = (error: BaseError | Error) => {
  if (!isSentryInitialized) {
    return;
  }
};
