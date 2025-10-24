import { BaseError } from './types/BaseError';
import { NetworkError } from './classes/NetworkError';
import { ApiError } from './classes/ApiError';
import { ErrorCodes } from './types/errorCodes';
import type { ErrorKind } from './types/errorKinds';

// 에러 코드 → ErrorKind 매핑

const CORE_ERROR_CODE_TO_KIND_MAP: Partial<Record<number, ErrorKind>> = {
  // Network Errors
  [ErrorCodes.NETWORK_ERROR]: 'NetworkError',
  [ErrorCodes.NETWORK_OFFLINE]: 'NetworkError',
  [ErrorCodes.NETWORK_TIMEOUT]: 'NetworkError',
  [ErrorCodes.NETWORK_CONNECTION_REFUSED]: 'NetworkError',
  [ErrorCodes.NETWORK_DNS_ERROR]: 'NetworkError',

  // Rate Limit
  [ErrorCodes.API_RATE_LIMIT]: 'ApiError',

  // API 통신 에러
  [ErrorCodes.API_ERROR]: 'ApiError',
  [ErrorCodes.API_BAD_REQUEST]: 'ApiError',
  [ErrorCodes.API_UNAUTHORIZED]: 'ApiError',
  [ErrorCodes.API_FORBIDDEN]: 'ApiError',
  [ErrorCodes.API_NOT_FOUND]: 'ApiError',
  [ErrorCodes.API_SERVER_ERROR]: 'ApiError',

  // TMDB API 에러
  [ErrorCodes.API_TMDB_ERROR]: 'ApiError',
  [ErrorCodes.API_TMDB_INVALID_KEY]: 'ApiError',
  [ErrorCodes.API_TMDB_NOT_FOUND]: 'ApiError',
  [ErrorCodes.API_TMDB_RATE_LIMIT]: 'ApiError',
  [ErrorCodes.API_TMDB_BAD_REQUEST]: 'ApiError',
  [ErrorCodes.API_TMDB_UNAUTHORIZED]: 'ApiError',
  [ErrorCodes.API_TMDB_FORBIDDEN]: 'ApiError',
  [ErrorCodes.API_TMDB_SERVER_ERROR]: 'ApiError',
  [ErrorCodes.API_TMDB_TIMEOUT]: 'ApiError',

  // OpenAI API 에러
  [ErrorCodes.API_OPENAI_ERROR]: 'ApiError',
  [ErrorCodes.API_OPENAI_RATE_LIMIT]: 'ApiError',
  [ErrorCodes.API_OPENAI_INVALID_KEY]: 'ApiError',
  [ErrorCodes.API_OPENAI_AUTH_ERROR]: 'ApiError',
  [ErrorCodes.API_OPENAI_PERMISSION_ERROR]: 'ApiError',
  [ErrorCodes.API_OPENAI_QUOTA_EXCEEDED]: 'ApiError',
  [ErrorCodes.API_OPENAI_SERVER_ERROR]: 'ApiError',
  [ErrorCodes.API_OPENAI_TIMEOUT]: 'ApiError',
  [ErrorCodes.API_OPENAI_PARSE_ERROR]: 'ApiError',

  // Client Errors
  [ErrorCodes.RENDER_ERROR]: 'ClientError',
  [ErrorCodes.COMPONENT_MOUNT_ERROR]: 'ClientError',
  [ErrorCodes.COMPONENT_UPDATE_ERROR]: 'ClientError',
  [ErrorCodes.COMPONENT_UNMOUNT_ERROR]: 'ClientError',
  [ErrorCodes.HOOK_ERROR]: 'ClientError',
  [ErrorCodes.SUSPENSE_ERROR]: 'ClientError',
  [ErrorCodes.LAZY_LOAD_ERROR]: 'ClientError',
} as const;

// 에러를 ErrorKind로 분류 (Sentry 태그용)
export function classifyCoreError(error: Error | BaseError): ErrorKind {
  // 1. BaseError가 아니면 UnknownError
  if (!(error instanceof BaseError)) {
    return 'UnknownError';
  }

  // 2. 인스턴스 타입 체크
  if (error instanceof NetworkError) return 'NetworkError';
  if (error instanceof ApiError) return 'ApiError';

  // 3. 에러 코드로 분류 (우선순위: 세부 매핑 → 범위 체크)
  const code = error.code;

  // 3-1. 세부 매핑 먼저 확인 (Rate Limit 등 특별 처리)
  const specificKind = CORE_ERROR_CODE_TO_KIND_MAP[code];
  if (specificKind) return specificKind;

  // 3-2. 범위 체크
  if (code >= 1000 && code < 2000) return 'ClientError'; // 렌더링/컴포넌트
  if (code >= 2000 && code < 3000) return 'ApiError'; // API
  if (code >= 3000 && code < 4000) return 'NetworkError'; // 네트워크
  if (code >= 9000) return 'UnknownError'; // 알 수 없는 에러

  // 기본값 (알 수 없는 에러)
  return 'UnknownError';
}

export const classifyError = classifyCoreError;
