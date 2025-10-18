import { AxiosError } from 'axios';
import { BaseError } from '../types/BaseError';
import { ErrorCodes } from '../types/errorCodes';

export type GenericApiErrorCode = (typeof ErrorCodes)[keyof Pick<
  typeof ErrorCodes,
  | 'API_ERROR'
  | 'API_INVALID_RESPONSE'
  | 'API_UNAUTHORIZED'
  | 'API_FORBIDDEN'
  | 'API_NOT_FOUND'
  | 'API_SERVER_ERROR'
  | 'API_RATE_LIMIT'
  | 'API_TIMEOUT'
  | 'API_BAD_REQUEST'
>];

export type TMDBErrorCode = (typeof ErrorCodes)[keyof Pick<
  typeof ErrorCodes,
  | 'API_TMDB_ERROR'
  | 'API_TMDB_INVALID_KEY'
  | 'API_TMDB_NOT_FOUND'
  | 'API_TMDB_RATE_LIMIT'
  | 'API_TMDB_BAD_REQUEST'
  | 'API_TMDB_UNAUTHORIZED'
  | 'API_TMDB_FORBIDDEN'
  | 'API_TMDB_SERVER_ERROR'
  | 'API_TMDB_TIMEOUT'
>];

export type OpenAIErrorCode = (typeof ErrorCodes)[keyof Pick<
  typeof ErrorCodes,
  | 'API_OPENAI_ERROR'
  | 'API_OPENAI_RATE_LIMIT'
  | 'API_OPENAI_INVALID_KEY'
  | 'API_OPENAI_AUTH_ERROR'
  | 'API_OPENAI_PERMISSION_ERROR'
  | 'API_OPENAI_QUOTA_EXCEEDED'
  | 'API_OPENAI_SERVER_ERROR'
  | 'API_OPENAI_TIMEOUT'
  | 'API_OPENAI_PARSE_ERROR'
>];

export type ApiErrorCode =
  | GenericApiErrorCode
  | TMDBErrorCode
  | OpenAIErrorCode;

export class ApiError extends BaseError {
  public readonly statusCode?: number;
  public readonly endpoint?: string;
  public readonly method?: string;
  public readonly responseData?: unknown;

  constructor(
    message: string,
    options?: {
      code?: ApiErrorCode;
      originalError?: Error;
      statusCode?: number;
      endpoint?: string;
      method?: string;
      responseData?: unknown;
      additionalData?: Record<string, unknown>;
    }
  ) {
    super(message, options?.code ?? ErrorCodes.API_ERROR, {
      originalError: options?.originalError,
      additionalData: {
        statusCode: options?.statusCode,
        endpoint: options?.endpoint,
        method: options?.method,
        ...options?.additionalData,
      },
      sentryContext: {
        tags: {
          statusCode: options?.statusCode
            ? String(options.statusCode)
            : 'unknown',
          endpoint: options?.endpoint ?? 'unknown',
          method: options?.method ?? 'unknown',
        },
      },
    });

    this.statusCode = options?.statusCode;
    this.endpoint = options?.endpoint;
    this.method = options?.method;
    this.responseData = options?.responseData;
  }

  getUserMessage(): string {
    switch (this.code) {
      case ErrorCodes.API_UNAUTHORIZED:
        return '인증이 필요합니다. 다시 로그인해주세요.';
      case ErrorCodes.API_FORBIDDEN:
        return '접근 권한이 없습니다.';
      case ErrorCodes.API_NOT_FOUND:
        return '요청한 데이터를 찾을 수 없습니다.';
      case ErrorCodes.API_RATE_LIMIT:
        return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
      case ErrorCodes.API_TIMEOUT:
        return '서버 응답 시간이 초과되었습니다. 다시 시도해주세요.';
      case ErrorCodes.API_SERVER_ERROR:
        return '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
      case ErrorCodes.API_BAD_REQUEST:
        return '잘못된 요청입니다.';
      case ErrorCodes.API_INVALID_RESPONSE:
        return '서버로부터 올바르지 않은 응답을 받았습니다.';

      // TMDB API 에러
      case ErrorCodes.API_TMDB_ERROR:
        return 'TMDB API 요청 중 문제가 발생했습니다.';
      case ErrorCodes.API_TMDB_INVALID_KEY:
        return 'TMDB API 키가 유효하지 않습니다. 설정을 확인해주세요.';
      case ErrorCodes.API_TMDB_NOT_FOUND:
        return '요청한 영화 정보를 찾을 수 없습니다.';
      case ErrorCodes.API_TMDB_RATE_LIMIT:
        return 'TMDB 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
      case ErrorCodes.API_TMDB_BAD_REQUEST:
        return 'TMDB 요청이 올바르지 않습니다.';
      case ErrorCodes.API_TMDB_UNAUTHORIZED:
        return 'TMDB 인증이 필요합니다.';
      case ErrorCodes.API_TMDB_FORBIDDEN:
        return 'TMDB 접근 권한이 없습니다.';
      case ErrorCodes.API_TMDB_SERVER_ERROR:
        return 'TMDB 서버에 문제가 발생했습니다.';
      case ErrorCodes.API_TMDB_TIMEOUT:
        return 'TMDB 서버 응답 시간이 초과되었습니다.';

      // OpenAI API 에러
      case ErrorCodes.API_OPENAI_ERROR:
        return 'AI 서비스 요청 중 문제가 발생했습니다.';
      case ErrorCodes.API_OPENAI_RATE_LIMIT:
        return 'AI 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
      case ErrorCodes.API_OPENAI_INVALID_KEY:
        return 'OpenAI API 키가 올바르지 않습니다. 설정을 확인해주세요.';
      case ErrorCodes.API_OPENAI_AUTH_ERROR:
        return 'OpenAI 인증에 실패했습니다.';
      case ErrorCodes.API_OPENAI_PERMISSION_ERROR:
        return 'OpenAI 서비스 권한이 없습니다.';
      case ErrorCodes.API_OPENAI_QUOTA_EXCEEDED:
        return 'AI 사용 한도를 초과했습니다. 크레딧을 충전해주세요.';
      case ErrorCodes.API_OPENAI_SERVER_ERROR:
        return 'OpenAI 서버에 문제가 발생했습니다.';
      case ErrorCodes.API_OPENAI_TIMEOUT:
        return 'OpenAI 응답 시간이 초과되었습니다.';
      case ErrorCodes.API_OPENAI_PARSE_ERROR:
        return 'AI 응답을 처리하는 중 문제가 발생했습니다.';

      default:
        return 'API 요청 중 문제가 발생했습니다.';
    }
  }

  static fromAxiosError(error: AxiosError): ApiError {
    const statusCode = error.response?.status;
    const endpoint = error.config?.url;
    const method = error.config?.method?.toUpperCase();

    // 상태 코드에 따라 적절한 에러 코드 할당
    let code: GenericApiErrorCode = ErrorCodes.API_ERROR;

    if (statusCode === 400) code = ErrorCodes.API_BAD_REQUEST;
    else if (statusCode === 401) code = ErrorCodes.API_UNAUTHORIZED;
    else if (statusCode === 403) code = ErrorCodes.API_FORBIDDEN;
    else if (statusCode === 404) code = ErrorCodes.API_NOT_FOUND;
    else if (statusCode === 429) code = ErrorCodes.API_RATE_LIMIT;
    else if (statusCode && statusCode >= 500)
      code = ErrorCodes.API_SERVER_ERROR;
    else if (error.code === 'ECONNABORTED') code = ErrorCodes.API_TIMEOUT;

    return new ApiError(error.message || 'API request failed', {
      code,
      originalError: error,
      statusCode,
      endpoint,
      method,
      responseData: error.response?.data,
    });
  }

  // 유효하지 않은 응답 에러 생성
  static invalidResponse(
    endpoint: string,
    reason: string,
    responseData?: unknown
  ): ApiError {
    return new ApiError(`Invalid API response from ${endpoint}: ${reason}`, {
      code: ErrorCodes.API_INVALID_RESPONSE,
      endpoint,
      responseData,
      additionalData: { reason },
    });
  }

  // TMDB API 에러 생성
  static tmdb(
    message: string,
    options?: {
      code?: TMDBErrorCode;
      originalError?: Error;
      statusCode?: number;
      endpoint?: string;
      serviceErrorCode?: number;
      serviceErrorMessage?: string;
    }
  ): ApiError {
    return new ApiError(message, {
      code: options?.code ?? ErrorCodes.API_TMDB_ERROR,
      originalError: options?.originalError,
      statusCode: options?.statusCode,
      endpoint: options?.endpoint,
      additionalData: {
        service: 'TMDB',
        serviceErrorCode: options?.serviceErrorCode,
        serviceErrorMessage: options?.serviceErrorMessage,
      },
    });
  }

  // OpenAI API 에러 생성
  static openai(
    message: string,
    options?: {
      code?: OpenAIErrorCode;
      originalError?: Error;
      statusCode?: number;
      endpoint?: string;
      serviceErrorCode?: string;
      serviceErrorMessage?: string;
    }
  ): ApiError {
    return new ApiError(message, {
      code: options?.code ?? ErrorCodes.API_OPENAI_ERROR,
      originalError: options?.originalError,
      statusCode: options?.statusCode,
      endpoint: options?.endpoint,
      additionalData: {
        service: 'OpenAI',
        serviceErrorCode: options?.serviceErrorCode,
        serviceErrorMessage: options?.serviceErrorMessage,
      },
    });
  }
}
