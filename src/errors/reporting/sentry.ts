/**
 * 간소화된 Sentry 인터페이스
 * @sentry/nextjs 표준 설정을 활용하는 단순한 래퍼
 */

import * as Sentry from '@sentry/nextjs';
import { BaseError } from '../types/BaseError';
import { classifyError } from '../errorClassify';

/**
 * 통합 에러 리포팅
 * 환경에 관계없이 동일한 인터페이스로 Sentry에 에러 리포팅
 */
export const reportToSentry = (
  error: BaseError | Error,
  context?: {
    tags?: Record<string, string>;
    user?: Sentry.User;
    extra?: Record<string, unknown>;
  }
) => {
  try {
    Sentry.withScope((scope) => {
      // 에러 분류 태그 추가
      if (error instanceof BaseError) {
        const errorKind = classifyError(error);
        scope.setTag('errorKind', errorKind);
        scope.setTag('errorCode', error.code);

        // BaseError의 Sentry 컨텍스트 적용
        const sentryContext = error.getSentryContext();

        if (sentryContext.level) {
          scope.setLevel(sentryContext.level);
        }

        if (sentryContext.tags) {
          Object.entries(sentryContext.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }

        if (sentryContext.extra) {
          scope.setContext('baseErrorDetails', sentryContext.extra);
        }

        if (sentryContext.user) {
          scope.setUser(sentryContext.user);
        }
      } else {
        // 일반 Error 처리
        const errorKind = classifyError(error);
        scope.setTag('errorKind', errorKind);
        scope.setLevel('error');
      }

      // 추가 컨텍스트 적용
      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }

      if (context?.user) {
        scope.setUser(context.user);
      }

      if (context?.extra) {
        scope.setContext('additionalContext', context.extra);
      }

      // 에러 캡처
      Sentry.captureException(error);
    });
  } catch (sentryError) {
    console.error('[Sentry] Failed to report error:', sentryError);
  }
};

/**
 * 브레드크럼 추가
 */
export const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
  try {
    Sentry.addBreadcrumb(breadcrumb);
  } catch (error) {
    console.error('[Sentry] Failed to add breadcrumb:', error);
  }
};

/**
 * 사용자 컨텍스트 설정
 */
export const setUserContext = (user: Sentry.User) => {
  try {
    Sentry.setUser(user);
  } catch (error) {
    console.error('[Sentry] Failed to set user context:', error);
  }
};

/**
 * 태그 설정
 */
export const setTag = (key: string, value: string) => {
  try {
    Sentry.setTag(key, value);
  } catch (error) {
    console.error('[Sentry] Failed to set tag:', error);
  }
};
