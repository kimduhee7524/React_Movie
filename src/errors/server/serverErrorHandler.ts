import { notFound, redirect } from 'next/navigation';
import { normalizeError } from '../errorNormalize';
import { reportToSentry } from '../reporting/sentry';
import { classifyError } from '../errorClassify';
import { BaseError } from '../types/BaseError';

/**
 * 서버 컴포넌트에서 사용할 에러 처리 유틸리티
 * SSR 환경에서 안전하게 에러를 처리합니다.
 */

interface ServerErrorHandlerOptions {
  /**
   * 404 에러일 때 notFound() 호출 여부
   */
  callNotFound?: boolean;

  /**
   * 리디렉션할 URL (설정 시 redirect() 호출)
   */
  redirectTo?: string;

  /**
   * 에러를 던질지 여부 (기본: true)
   * false로 설정하면 에러를 처리하고 null을 반환
   */
  throwError?: boolean;
}

/**
 * 서버에서 에러를 안전하게 처리
 */
export function handleServerError(
  error: unknown,
  options: ServerErrorHandlerOptions = {}
): BaseError | null {
  const { callNotFound = false, redirectTo, throwError = true } = options;

  try {
    // 에러 정규화 및 리포팅
    const normalizedError = normalizeError(error);

    // 서버 환경 메타데이터 추가
    normalizedError.metadata.isServerSide = true;
    normalizedError.metadata.timestamp = new Date().toISOString();

    // 서버에서 console.error 로깅 및 Sentry 리포팅
    console.error('[Server Error]', {
      message: normalizedError.message,
      code: normalizedError.code,
      kind: classifyError(normalizedError),
      metadata: normalizedError.metadata,
    });

    // 서버 사이드 Sentry 리포팅
    reportToSentry(normalizedError, {
      tags: { serverSide: 'true', errorHandler: 'serverErrorHandler' },
    });

    // 404 처리
    if (callNotFound || normalizedError.code === 'RESOURCE_NOT_FOUND') {
      notFound();
    }

    // 리디렉션 처리
    if (redirectTo) {
      redirect(redirectTo);
    }

    // 에러 던지기 또는 반환
    if (throwError) {
      throw normalizedError;
    }

    return normalizedError;
  } catch (handlingError) {
    // 에러 처리 중 에러 발생 시 안전장치
    console.error(
      '[Server Error Handler] Failed to handle error:',
      handlingError
    );

    if (throwError) {
      throw new Error('Internal Server Error');
    }

    return null;
  }
}

/**
 * API 라우트에서 사용할 에러 응답 생성기
 */
export function createErrorResponse(error: unknown, status = 500): Response {
  const normalizedError = normalizeError(error);

  // 서버 환경 메타데이터 추가
  normalizedError.metadata.isServerSide = true;
  normalizedError.metadata.apiRoute = true;

  console.error('[API Error]', normalizedError);

  // API 에러 Sentry 리포팅
  reportToSentry(normalizedError, {
    tags: { apiRoute: 'true', statusCode: status.toString() },
  });

  return Response.json(
    {
      error: {
        message: normalizedError.message,
        code: normalizedError.code,
        kind: classifyError(normalizedError),
      },
    },
    { status }
  );
}

/**
 * 서버 액션에서 사용할 에러 처리
 */
export function handleServerActionError(error: unknown): never {
  const normalizedError = normalizeError(error);
  normalizedError.metadata.isServerSide = true;
  normalizedError.metadata.serverAction = true;

  console.error('[Server Action Error]', normalizedError);

  // 서버 액션 에러 Sentry 리포팅
  reportToSentry(normalizedError, {
    tags: { serverAction: 'true' },
  });

  throw normalizedError;
}
