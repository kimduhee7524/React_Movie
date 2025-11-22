import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 서버사이드 Sentry 초기화
    await import('../sentry.server.config');
  }
}

// Next.js 16에서 에러 자동 캐처
export const onRequestError = Sentry.captureRequestError;
