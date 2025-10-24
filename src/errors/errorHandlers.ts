import { BaseError } from './types/BaseError';
import { normalizeError } from './errorNormalize';
import { reportError } from './reporting/errorReport';

/**
 * 전역 에러 핸들러 (정규화 + 리포팅)
 * - 애플리케이션 최상위 레벨에서 사용
 * - 정규화와 리포팅을 한 번에 처리
 */
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
  // 먼저 원본 에러를 정규화하여 적절한 타입으로 분류
  const normalizedError = normalizeError(error);

  // 항상 정규화된 에러에 React 관련 정보만 추가
  normalizedError.metadata.componentStack = errorInfo.componentStack;

  // Sentry 컨텍스트에 ErrorBoundary 태그 추가
  if (normalizedError.sentryContext) {
    normalizedError.sentryContext.tags = {
      ...normalizedError.sentryContext.tags,
      errorBoundary: 'true',
    };
  }

  // 한 번만 리포팅
  reportError(normalizedError);
  return normalizedError;
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
