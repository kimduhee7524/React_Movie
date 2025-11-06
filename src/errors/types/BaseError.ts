import { ErrorCode, ErrorSeverity, SeverityLevel } from './errorCodes';

export interface ErrorMetadata {
  timestamp: Date;
  userAgent?: string;
  url?: string;
  componentStack?: string;
  additionalData?: Record<string, unknown>;
  redirectTo?: string; // 에러 후 리다이렉트 경로
  isServerSide?: boolean; // 서버 사이드에서 발생한 에러인지
  apiRoute?: boolean; // API 라우트에서 발생한 에러인지
  serverAction?: boolean; // 서버 액션에서 발생한 에러인지
}

export interface SentryErrorContext {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  level?: SeverityLevel;
}

//모든 커스텀 에러는 이 클래스를 상속받아야 함
export abstract class BaseError extends Error {
  public readonly code: number;
  public readonly severity: SeverityLevel;
  public readonly metadata: ErrorMetadata;
  public readonly originalError?: Error;
  public readonly sentryContext?: SentryErrorContext;

  constructor(
    message: string,
    code: number,
    options?: {
      originalError?: Error;
      additionalData?: Record<string, unknown>;
      sentryContext?: SentryErrorContext;
    }
  ) {
    super(message);

    // Error.name을 클래스 이름으로 설정
    this.name = this.constructor.name;

    // 에러 코드 및 심각도 설정
    this.code = code;
    this.severity = (ErrorSeverity[code as ErrorCode] ??
      'error') as SeverityLevel;

    // 원본 에러 보존
    this.originalError = options?.originalError;

    // 메타데이터 설정
    this.metadata = {
      timestamp: new Date(),
      userAgent:
        typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      additionalData: options?.additionalData,
    };

    // Sentry 컨텍스트
    this.sentryContext = options?.sentryContext;

    // 프로토타입 체인 복원
    Object.setPrototypeOf(this, new.target.prototype);

    // 스택 트레이스 캡처
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // 에러를 JSON으로 직렬화 (로깅용)
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      stack: this.stack,
      metadata: this.metadata,
      originalError: this.originalError
        ? {
            name: this.originalError.name,
            message: this.originalError.message,
            stack: this.originalError.stack,
          }
        : undefined,
    };
  }

  // 사용자에게 보여줄 메시지
  abstract getUserMessage(): string;

  // Sentry에 보고할 때 사용할 컨텍스트
  getSentryContext(): SentryErrorContext {
    return {
      ...this.sentryContext,
      level: this.severity,
      tags: {
        errorCode: String(this.code),
        errorCategory: this.getErrorCategory(),
        ...this.sentryContext?.tags,
      },
      extra: {
        ...this.metadata,
        ...this.sentryContext?.extra,
      },
    };
  }

  // 에러 카테고리 반환
  private getErrorCategory(): string {
    if (this.code >= 1000 && this.code < 2000) return 'RENDER';
    if (this.code >= 2000 && this.code < 2100) return 'API';
    if (this.code >= 2100 && this.code < 2200) return 'API_TMDB';
    if (this.code >= 2200 && this.code < 2300) return 'API_OPENAI';
    if (this.code >= 2300 && this.code < 3000) return 'API_OTHER';
    if (this.code >= 3000 && this.code < 4000) return 'NETWORK';
    if (this.code >= 4000 && this.code < 5000) return 'VALIDATION';
    if (this.code >= 9000) return 'UNKNOWN';
    return 'CUSTOM';
  }
}
