import { BaseError } from './types/BaseError';
import { normalizeError } from './errorNormalize';
import { reportError } from './reporting/errorReport';
import {
  ServerError,
  ServerContext,
  ServerErrorCode,
} from './classes/ServerError';
import { ErrorInfo } from 'react';
import { notFound, redirect } from 'next/navigation';

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
  errorInfo: ErrorInfo
): BaseError => {
  // 먼저 원본 에러를 정규화하여 적절한 타입으로 분류
  const normalizedError = normalizeError(error);

  normalizedError.metadata.componentStack =
    errorInfo.componentStack || undefined;

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

//서버 에러 핸들러

export interface ServerErrorConfig {
  //404 에러 시 notFound() 호출 여부
  redirectToNotFound?: boolean;
  //리디렉션할 URL
  redirectTo?: string;
  //에러 던질지 여부
  shouldThrow?: boolean;
  //서버 컨텍스트
  context?: ServerContext;
  //사용자 액션 가이드 (선택사항)
  userAction?: string;
  //에러 심각도 (선택사항)
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

//서버 에러 핸들러
export const handleServerError = (
  error: unknown,
  config: ServerErrorConfig = {}
): ServerError => {
  const {
    redirectToNotFound = false,
    redirectTo,
    shouldThrow = false,
    context = 'server-component',
    userAction,
    severity = 'medium',
  } = config;

  //  에러 정규화
  const normalizedError = normalizeError(error);

  // ServerError로 변환
  const serverError = new ServerError(normalizedError.message, {
    code: normalizedError.code as ServerErrorCode,
    originalError: normalizedError.originalError,
    context,
    userAction,
    severity,
    additionalData: {
      ...normalizedError.metadata.additionalData,
      originalErrorName: normalizedError.name,
    },
  });

  reportError(serverError);

  if (redirectToNotFound) {
    notFound();
  }

  if (redirectTo) {
    redirect(redirectTo);
  }

  // 에러 던지기 또는 반환
  if (shouldThrow) {
    throw serverError;
  }

  return serverError;
};

//서버 액션 전용 에러 핸들러
export const handleServerActionError = (error: unknown): never => {
  throw handleServerError(error, {
    context: 'server-action',
  });
};

// API 라우트 전용 에러 응답 생성기
export const createServerErrorResponse = (
  error: unknown,
  status = 500
): Response => {
  const serverError = handleServerError(error, {
    context: 'api-route',
  });

  return Response.json(
    {
      error: serverError.toClientError(),
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID?.() || Date.now().toString(),
    },
    { status }
  );
};
