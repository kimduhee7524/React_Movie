import { BaseError } from '../types/BaseError';
import { ErrorCodes } from '../types/errorCodes';

export class NetworkError extends BaseError {
  constructor(
    message: string,
    options?: {
      code?: (typeof ErrorCodes)[keyof Pick<
        typeof ErrorCodes,
        | 'NETWORK_ERROR'
        | 'NETWORK_OFFLINE'
        | 'NETWORK_TIMEOUT'
        | 'NETWORK_CONNECTION_REFUSED'
        | 'NETWORK_DNS_ERROR'
      >];
      originalError?: Error;
      url?: string;
      additionalData?: Record<string, unknown>;
    }
  ) {
    super(message, options?.code ?? ErrorCodes.NETWORK_ERROR, {
      originalError: options?.originalError,
      additionalData: {
        url: options?.url,
        isOnline:
          typeof navigator !== 'undefined' ? navigator.onLine : undefined,
        ...options?.additionalData,
      },
    });
  }

  getUserMessage(): string {
    switch (this.code) {
      case ErrorCodes.NETWORK_OFFLINE:
        return '인터넷 연결이 끊어졌습니다. 연결을 확인해주세요.';
      case ErrorCodes.NETWORK_TIMEOUT:
        return '네트워크 연결 시간이 초과되었습니다.';
      case ErrorCodes.NETWORK_CONNECTION_REFUSED:
        return '서버에 연결할 수 없습니다.';
      case ErrorCodes.NETWORK_DNS_ERROR:
        return 'DNS 조회에 실패했습니다.';
      default:
        return '네트워크 연결에 문제가 발생했습니다.';
    }
  }

  // 오프라인 에러 생성
  static offline(): NetworkError {
    return new NetworkError('Network is offline', {
      code: ErrorCodes.NETWORK_OFFLINE,
    });
  }

  // 타임아웃 에러 생성
  static timeout(url: string, timeout: number): NetworkError {
    return new NetworkError(`Network timeout after ${timeout}ms`, {
      code: ErrorCodes.NETWORK_TIMEOUT,
      url,
      additionalData: { timeout },
    });
  }

  // 연결 거부 에러 생성
  static connectionRefused(url: string, originalError: Error): NetworkError {
    return new NetworkError(`Connection refused to ${url}`, {
      code: ErrorCodes.NETWORK_CONNECTION_REFUSED,
      originalError,
      url,
    });
  }
}
