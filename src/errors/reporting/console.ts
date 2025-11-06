import { BaseError } from '../types/BaseError';

// 간단한 콘솔 로깅 - 개발 환경

export const logErrorToConsole = (error: BaseError | Error): void => {
  if (process.env.NODE_ENV === 'production') return;

  if (error instanceof BaseError) {
    console.error(`[${error.code}] ${error.name}: ${error.message}`, {
      severity: error.severity,
      metadata: error.metadata,
      originalError: error.originalError,
      stack: error.stack,
    });
  } else {
    console.error('[Unhandled Error]', error);
  }
};
