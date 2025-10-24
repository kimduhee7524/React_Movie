import * as Sentry from '@sentry/react';
import { BaseError } from '../types/BaseError';
import { classifyError } from '../errorClassify';

let isSentryInitialized = false;

export const initializeSentry = (
  dsn: string,
  options?: Sentry.BrowserOptions
) => {
  try {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: 1.0,
      beforeSend(event) {
        // 콘솔 출력은 console.ts에서 이미 처리하므로 여기서는 생략
        return event;
      },
      ...options,
    });

    isSentryInitialized = true;
    console.log('[Sentry] Successfully initialized');
  } catch (error) {
    console.error('[Sentry] Failed to initialize:', error);
  }
};

export const reportToSentry = (error: BaseError | Error) => {
  if (!isSentryInitialized) {
    console.warn('[Sentry] Not initialized, skipping error report');
    return;
  }

  try {
    if (error instanceof BaseError) {
      // BaseError의 getSentryContext() 활용
      const sentryContext = error.getSentryContext();

      Sentry.withScope((scope) => {
        // 에러 분류 추가
        const errorKind = classifyError(error);
        scope.setTag('errorKind', errorKind);

        // BaseError에서 제공하는 컨텍스트 적용
        if (sentryContext.level) {
          scope.setLevel(sentryContext.level);
        }

        if (sentryContext.tags) {
          Object.entries(sentryContext.tags).forEach(([key, value]) => {
            scope.setTag(key, value);
          });
        }

        if (sentryContext.extra) {
          scope.setContext('errorDetails', sentryContext.extra);
        }

        if (sentryContext.user) {
          scope.setUser(sentryContext.user);
        }

        Sentry.captureException(error);
      });
    } else {
      // 일반 Error의 경우 분류만 추가
      const errorKind = classifyError(error);
      Sentry.withScope((scope) => {
        scope.setTag('errorKind', errorKind);
        scope.setLevel('error');
        Sentry.captureException(error);
      });
    }
  } catch (sentryError) {
    console.error('[Sentry] Failed to report error:', sentryError);
  }
};

export const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
  if (isSentryInitialized) {
    Sentry.addBreadcrumb(breadcrumb);
  }
};

export const setUserContext = (user: Sentry.User) => {
  if (isSentryInitialized) {
    Sentry.setUser(user);
  }
};

export const setTag = (key: string, value: string) => {
  if (isSentryInitialized) {
    Sentry.setTag(key, value);
  }
};
