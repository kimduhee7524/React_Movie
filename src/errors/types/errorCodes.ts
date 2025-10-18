export const ErrorCodes = {
  // 1000번대: 렌더링/컴포넌트 에러
  RENDER_ERROR: 1000,
  COMPONENT_MOUNT_ERROR: 1001,
  COMPONENT_UPDATE_ERROR: 1002,
  COMPONENT_UNMOUNT_ERROR: 1003,
  HOOK_ERROR: 1004,
  SUSPENSE_ERROR: 1005,
  LAZY_LOAD_ERROR: 1006,

  // 2000-2099: API 응답 에러 (범용)
  API_ERROR: 2000,
  API_INVALID_RESPONSE: 2001,
  API_UNAUTHORIZED: 2002, // 401
  API_FORBIDDEN: 2003, // 403
  API_NOT_FOUND: 2004, // 404
  API_SERVER_ERROR: 2005, // 500
  API_RATE_LIMIT: 2006, // 429
  API_TIMEOUT: 2007,
  API_BAD_REQUEST: 2008, // 400

  // 2100-2199: TMDB API 에러
  API_TMDB_ERROR: 2100,
  API_TMDB_INVALID_KEY: 2101,
  API_TMDB_NOT_FOUND: 2102,
  API_TMDB_RATE_LIMIT: 2103,
  API_TMDB_BAD_REQUEST: 2104,
  API_TMDB_UNAUTHORIZED: 2105,
  API_TMDB_FORBIDDEN: 2106,
  API_TMDB_SERVER_ERROR: 2107,
  API_TMDB_TIMEOUT: 2108,

  // 2200-2299: OpenAI API 에러
  API_OPENAI_ERROR: 2200,
  API_OPENAI_RATE_LIMIT: 2201,
  API_OPENAI_INVALID_KEY: 2202,
  API_OPENAI_AUTH_ERROR: 2203,
  API_OPENAI_PERMISSION_ERROR: 2204,
  API_OPENAI_QUOTA_EXCEEDED: 2205,
  API_OPENAI_SERVER_ERROR: 2206,
  API_OPENAI_TIMEOUT: 2207,
  API_OPENAI_PARSE_ERROR: 2208,

  // 3000번대: 네트워크 에러
  NETWORK_ERROR: 3000,
  NETWORK_OFFLINE: 3001,
  NETWORK_TIMEOUT: 3002,
  NETWORK_CONNECTION_REFUSED: 3003,
  NETWORK_DNS_ERROR: 3004,

  // 9000번대: 알 수 없는/기타 에러
  UNKNOWN_ERROR: 9000,
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export type SeverityLevel = 'info' | 'warning' | 'error' | 'fatal';

export const ErrorCategory = {
  isClientError: (code: number) => code >= 1000 && code < 2000,
  isApiError: (code: number) => code >= 2000 && code < 3000,
  isNetworkError: (code: number) => code >= 3000 && code < 4000,
  // 4000번대는 현재 사용 안함
  isUnknownError: (code: number) => code >= 9000,
} as const;

export const ErrorSeverity: Record<ErrorCode, SeverityLevel> = {
  // 렌더링 에러
  [ErrorCodes.RENDER_ERROR]: 'error',
  [ErrorCodes.COMPONENT_MOUNT_ERROR]: 'error',
  [ErrorCodes.COMPONENT_UPDATE_ERROR]: 'error',
  [ErrorCodes.COMPONENT_UNMOUNT_ERROR]: 'warning',
  [ErrorCodes.HOOK_ERROR]: 'error',
  [ErrorCodes.SUSPENSE_ERROR]: 'warning',
  [ErrorCodes.LAZY_LOAD_ERROR]: 'error',

  // API 에러 (범용)
  [ErrorCodes.API_ERROR]: 'error',
  [ErrorCodes.API_INVALID_RESPONSE]: 'error',
  [ErrorCodes.API_UNAUTHORIZED]: 'warning',
  [ErrorCodes.API_FORBIDDEN]: 'warning',
  [ErrorCodes.API_NOT_FOUND]: 'info',
  [ErrorCodes.API_SERVER_ERROR]: 'error',
  [ErrorCodes.API_RATE_LIMIT]: 'warning',
  [ErrorCodes.API_TIMEOUT]: 'warning',
  [ErrorCodes.API_BAD_REQUEST]: 'warning',

  // TMDB API 에러
  [ErrorCodes.API_TMDB_ERROR]: 'error',
  [ErrorCodes.API_TMDB_INVALID_KEY]: 'error',
  [ErrorCodes.API_TMDB_NOT_FOUND]: 'info',
  [ErrorCodes.API_TMDB_RATE_LIMIT]: 'warning',
  [ErrorCodes.API_TMDB_BAD_REQUEST]: 'warning',
  [ErrorCodes.API_TMDB_UNAUTHORIZED]: 'warning',
  [ErrorCodes.API_TMDB_FORBIDDEN]: 'warning',
  [ErrorCodes.API_TMDB_SERVER_ERROR]: 'error',
  [ErrorCodes.API_TMDB_TIMEOUT]: 'warning',

  // OpenAI API 에러
  [ErrorCodes.API_OPENAI_ERROR]: 'error',
  [ErrorCodes.API_OPENAI_RATE_LIMIT]: 'warning',
  [ErrorCodes.API_OPENAI_INVALID_KEY]: 'error',
  [ErrorCodes.API_OPENAI_AUTH_ERROR]: 'warning',
  [ErrorCodes.API_OPENAI_PERMISSION_ERROR]: 'warning',
  [ErrorCodes.API_OPENAI_QUOTA_EXCEEDED]: 'warning',
  [ErrorCodes.API_OPENAI_SERVER_ERROR]: 'error',
  [ErrorCodes.API_OPENAI_TIMEOUT]: 'warning',
  [ErrorCodes.API_OPENAI_PARSE_ERROR]: 'error',

  // 네트워크 에러
  [ErrorCodes.NETWORK_ERROR]: 'error',
  [ErrorCodes.NETWORK_OFFLINE]: 'warning',
  [ErrorCodes.NETWORK_TIMEOUT]: 'warning',
  [ErrorCodes.NETWORK_CONNECTION_REFUSED]: 'error',
  [ErrorCodes.NETWORK_DNS_ERROR]: 'error',

  // 알 수 없는 에러
  [ErrorCodes.UNKNOWN_ERROR]: 'error',
} as const;
