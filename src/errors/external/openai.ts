import { ErrorCodes } from '../types/errorCodes';

export enum OpenAIErrorType {
  // 401 - Authentication Errors
  INVALID_AUTHENTICATION = 'invalid_authentication',
  INCORRECT_API_KEY = 'incorrect_api_key',
  NOT_ORGANIZATION_MEMBER = 'not_organization_member',
  IP_NOT_AUTHORIZED = 'ip_not_authorized',

  // 403 - Permission Errors
  UNSUPPORTED_COUNTRY = 'unsupported_country',

  // 429 - Rate Limit Errors
  RATE_LIMIT_REACHED = 'rate_limit_reached',
  QUOTA_EXCEEDED = 'quota_exceeded',

  // 500 - Server Errors
  SERVER_ERROR = 'server_error',

  // 503 - Service Unavailable
  ENGINE_OVERLOADED = 'engine_overloaded',
  SLOW_DOWN = 'slow_down',

  // Unknown
  UNKNOWN = 'unknown',
}

export interface OpenAIErrorResponse {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

// OpenAI 에러 타입을 감지하는 함수
export const detectOpenAIErrorType = (
  statusCode: number,
  message: string
): OpenAIErrorType => {
  switch (statusCode) {
    case 401:
      if (message.includes('Incorrect API key')) {
        return OpenAIErrorType.INCORRECT_API_KEY;
      }
      if (message.includes('not a member')) {
        return OpenAIErrorType.NOT_ORGANIZATION_MEMBER;
      }
      return OpenAIErrorType.INVALID_AUTHENTICATION;

    case 403:
      return OpenAIErrorType.UNSUPPORTED_COUNTRY;

    case 429:
      if (message.includes('quota')) {
        return OpenAIErrorType.QUOTA_EXCEEDED;
      }
      return OpenAIErrorType.RATE_LIMIT_REACHED;

    case 500:
      return OpenAIErrorType.SERVER_ERROR;

    case 503:
      if (message.includes('overloaded')) {
        return OpenAIErrorType.ENGINE_OVERLOADED;
      }
      return OpenAIErrorType.SLOW_DOWN;

    default:
      return OpenAIErrorType.UNKNOWN;
  }
};

// OpenAI 에러 타입을 새로운 2200번대 코드로 매핑
export const mapOpenAIToApiErrorCode = (errorType: OpenAIErrorType): number => {
  switch (errorType) {
    case OpenAIErrorType.INCORRECT_API_KEY:
      return ErrorCodes.API_OPENAI_INVALID_KEY;

    case OpenAIErrorType.INVALID_AUTHENTICATION:
    case OpenAIErrorType.NOT_ORGANIZATION_MEMBER:
    case OpenAIErrorType.IP_NOT_AUTHORIZED:
      return ErrorCodes.API_OPENAI_AUTH_ERROR;

    case OpenAIErrorType.UNSUPPORTED_COUNTRY:
      return ErrorCodes.API_OPENAI_PERMISSION_ERROR;

    case OpenAIErrorType.RATE_LIMIT_REACHED:
    case OpenAIErrorType.SLOW_DOWN:
      return ErrorCodes.API_OPENAI_RATE_LIMIT;

    case OpenAIErrorType.QUOTA_EXCEEDED:
      return ErrorCodes.API_OPENAI_QUOTA_EXCEEDED;

    case OpenAIErrorType.SERVER_ERROR:
    case OpenAIErrorType.ENGINE_OVERLOADED:
      return ErrorCodes.API_OPENAI_SERVER_ERROR;

    default:
      return ErrorCodes.API_OPENAI_ERROR;
  }
};

// OpenAI API 응답인지 확인하는 타입 가드
export const isOpenAIError = (data: unknown): data is OpenAIErrorResponse => {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;
  if (
    !('error' in obj) ||
    typeof obj.error !== 'object' ||
    obj.error === null
  ) {
    return false;
  }

  const error = obj.error as Record<string, unknown>;
  return (
    'message' in error &&
    typeof error.message === 'string' &&
    'type' in error &&
    typeof error.type === 'string'
  );
};
