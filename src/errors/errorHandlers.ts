import { BaseError } from './types/BaseError';
import { ClientError } from './classes/ClientError';
import { normalizeError } from './errorNormalize';
import { reportError } from './reporting/errorReport';

// 전역 에러 핸들러
export const handleError = (error: unknown): BaseError => {
  const normalizedError = normalizeError(error);

  reportError(normalizedError);

  return normalizedError;
};

//React Error Boundary에서 사용할 에러 핸들러
export const handleReactError = (
  error: Error,
  errorInfo: { componentStack?: string }
): BaseError => {
  const customError = new ClientError(error.message, {
    originalError: error,
    componentStack: errorInfo.componentStack,
  });

  return handleError(customError);
};

// 전역 에러 핸들러 설정
// React ErrorBoundary가 못 잡는 에러들을 처리:

export const setupGlobalErrorHandlers = () => {
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    const error = handleError(event.reason);
    console.error('[Unhandled Promise Rejection]', error);
  });

  window.addEventListener('error', (event) => {
    event.preventDefault();
    const error = handleError(event.error);
    console.error('[Global JavaScript Error]', error);
  });

  console.log('[ErrorHandler] Global error handlers initialized');
};
