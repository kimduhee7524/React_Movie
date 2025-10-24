import { BaseError } from '../types/BaseError';
import { logErrorToConsole } from './console';
import { reportToSentry } from './sentry';

/**
 * 통합 에러 리포팅 (콘솔 + Sentry)
 * - 개발환경: 콘솔 로깅
 * - 프로덕션: Sentry 전송
 */
export const reportError = (error: BaseError): void => {
  logErrorToConsole(error);
  reportToSentry(error);
};
