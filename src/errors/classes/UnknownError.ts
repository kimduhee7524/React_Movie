import { BaseError } from '../types/BaseError';
import { ErrorCodes } from '../types/errorCodes';

export class UnknownError extends BaseError {
  constructor(
    message: string,
    options?: {
      originalError?: Error;
      additionalData?: Record<string, unknown>;
    }
  ) {
    super(message, ErrorCodes.UNKNOWN_ERROR, {
      originalError: options?.originalError,
      additionalData: options?.additionalData,
      sentryContext: {
        tags: {
          errorType: 'unknown',
          hasOriginalError: options?.originalError ? 'yes' : 'no',
        },
      },
    });
  }

  getUserMessage(): string {
    return '알 수 없는 문제가 발생했습니다. 새로고침 후 다시 시도해주세요.';
  }

  // 분류할 수 없는 일반적인 에러 생성
  static general(message?: string, originalError?: Error): UnknownError {
    return new UnknownError(message ?? 'Unknown error occurred', {
      originalError,
    });
  }
}
