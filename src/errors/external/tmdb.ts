import { ErrorCodes } from '../types/errorCodes';

export const TMDBErrorCodes = {
  SUCCESS: 1,
  INVALID_SERVICE: 2,
  AUTHENTICATION_FAILED: 3,
  INVALID_FORMAT: 4,
  INVALID_PARAMETERS: 5,
  INVALID_ID: 6,
  INVALID_API_KEY: 7,
  DUPLICATE_ENTRY: 8,
  SERVICE_OFFLINE: 9,
  SUSPENDED_API_KEY: 10,
  INTERNAL_ERROR: 11,
  AUTH_FAILED: 14,
  FAILED: 15,
  VALIDATION_FAILED: 18,
  INVALID_ACCEPT_HEADER: 19,
  INVALID_DATE_RANGE: 20,
  ENTRY_NOT_FOUND: 21,
  INVALID_PAGE: 22,
  INVALID_DATE: 23,
  BACKEND_TIMEOUT: 24,
  REQUEST_COUNT_EXCEEDED: 25,
  INVALID_TIMEZONE: 29,
  RESOURCE_NOT_FOUND: 34,
  INVALID_REQUEST_TOKEN: 30,
  TOKEN_NOT_APPROVED: 31,
  INVALID_SESSION_ID: 32,
  RESOURCE_PRIVATE: 35,
} as const;

export interface TMDBErrorResponse {
  status_code: number;
  status_message: string;
  success: false;
}

// TMDB 에러 코드를 새로운 2100번대 코드로 매핑
export const mapTMDBToApiErrorCode = (tmdbCode: number): number => {
  // 인증 에러 -> API_TMDB_UNAUTHORIZED
  const unauthorizedCodes: number[] = [
    TMDBErrorCodes.INVALID_API_KEY,
    TMDBErrorCodes.SUSPENDED_API_KEY,
    TMDBErrorCodes.AUTHENTICATION_FAILED,
  ];
  if (unauthorizedCodes.includes(tmdbCode)) {
    return ErrorCodes.API_TMDB_UNAUTHORIZED;
  }

  // 접근 금지 -> API_TMDB_FORBIDDEN
  const forbiddenCodes: number[] = [
    TMDBErrorCodes.AUTH_FAILED,
    TMDBErrorCodes.RESOURCE_PRIVATE,
  ];
  if (forbiddenCodes.includes(tmdbCode)) {
    return ErrorCodes.API_TMDB_FORBIDDEN;
  }

  // 찾을 수 없음 -> API_TMDB_NOT_FOUND
  const notFoundCodes: number[] = [
    TMDBErrorCodes.ENTRY_NOT_FOUND,
    TMDBErrorCodes.RESOURCE_NOT_FOUND,
  ];
  if (notFoundCodes.includes(tmdbCode)) {
    return ErrorCodes.API_TMDB_NOT_FOUND;
  }

  // Rate Limit -> API_TMDB_RATE_LIMIT
  if (tmdbCode === TMDBErrorCodes.REQUEST_COUNT_EXCEEDED) {
    return ErrorCodes.API_TMDB_RATE_LIMIT;
  }

  // 타임아웃 -> API_TMDB_TIMEOUT
  if (tmdbCode === TMDBErrorCodes.BACKEND_TIMEOUT) {
    return ErrorCodes.API_TMDB_TIMEOUT;
  }

  // 잘못된 요청 -> API_TMDB_BAD_REQUEST
  const badRequestCodes: number[] = [
    TMDBErrorCodes.INVALID_FORMAT,
    TMDBErrorCodes.INVALID_PARAMETERS,
    TMDBErrorCodes.INVALID_ID,
    TMDBErrorCodes.VALIDATION_FAILED,
    TMDBErrorCodes.INVALID_PAGE,
    TMDBErrorCodes.INVALID_DATE,
  ];
  if (badRequestCodes.includes(tmdbCode)) {
    return ErrorCodes.API_TMDB_BAD_REQUEST;
  }

  // 서버 에러 -> API_TMDB_SERVER_ERROR
  const serverErrorCodes: number[] = [
    TMDBErrorCodes.INTERNAL_ERROR,
    TMDBErrorCodes.SERVICE_OFFLINE,
    TMDBErrorCodes.FAILED,
  ];
  if (serverErrorCodes.includes(tmdbCode)) {
    return ErrorCodes.API_TMDB_SERVER_ERROR;
  }

  // 기타 -> API_TMDB_ERROR
  return ErrorCodes.API_TMDB_ERROR;
};

// TMDB API 응답인지 확인하는 타입 가드
export const isTMDBError = (data: unknown): data is TMDBErrorResponse => {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;
  return (
    'status_code' in obj &&
    typeof obj.status_code === 'number' &&
    'status_message' in obj &&
    typeof obj.status_message === 'string' &&
    'success' in obj &&
    obj.success === false
  );
};
