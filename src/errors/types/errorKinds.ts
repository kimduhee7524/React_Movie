export type ErrorKind =
  | 'ClientError' // 1. 유저 상호작용으로 인한 에러 (렌더링, 컴포넌트, 유효성 검증 등)
  | 'ApiError' // 2. API 통신으로 인한 에러 (HTTP 에러, Rate Limit 포함)
  | 'NetworkError' // 3. 환경으로 인한 에러 (오프라인, DNS, 연결 실패 등)
  | 'UnknownError'; // 4. 원인 불명의 에러

// Sentry 태깅 및 로그에 포함될 정보
export interface ErrorContext {
  // 외부 서비스 이름 (TMDB, OpenAI 등)
  service?: string;

  // API 엔드포인트
  endpoint?: string;

  // HTTP 상태 코드
  statusCode?: number;

  // 사용자 ID (Sentry user context)
  userId?: string;

  // 컴포넌트 스택 (React 에러)
  componentStack?: string;

  // 추가 메타데이터
  metadata?: Record<string, unknown>;
}

// ErrorKind별 로그 레벨 매핑
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const ERROR_KIND_LOG_LEVEL: Record<ErrorKind, LogLevel> = {
  ClientError: 'error', // 유저 상호작용 에러
  ApiError: 'error', // API 통신 에러
  NetworkError: 'warn', // 환경 에러
  UnknownError: 'fatal', // 원인 불명 에러
};

// ErrorKind에 맞는 로그 레벨 반환
export function getLogLevel(errorKind: ErrorKind): LogLevel {
  return ERROR_KIND_LOG_LEVEL[errorKind];
}

// ErrorKind별 Sentry 태그 생성
export function getSentryTags(
  errorKind: ErrorKind,
  context?: ErrorContext
): Record<string, string> {
  const tags: Record<string, string> = {
    errorKind,
    logLevel: getLogLevel(errorKind),
  };

  if (context?.service) {
    tags.service = context.service;
  }

  if (context?.endpoint) {
    tags.endpoint = context.endpoint;
  }

  if (context?.statusCode) {
    tags.statusCode = String(context.statusCode);
  }

  return tags;
}
