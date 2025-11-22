import { BaseError } from '../types/BaseError';
import { ErrorCodes } from '../types/errorCodes';

export type ServerErrorCode = (typeof ErrorCodes)[keyof Pick<
  typeof ErrorCodes,
  | 'API_ERROR'
  | 'API_TMDB_ERROR'
  | 'API_OPENAI_ERROR'
  | 'NETWORK_ERROR'
  | 'API_SERVER_ERROR'
>];

export type ServerContext =
  | 'server-component'
  | 'api-route'
  | 'server-action'
  | 'middleware';

export interface ClientErrorResponse {
  message: string;
  code: string;
  kind: 'network' | 'api' | 'client' | 'server' | 'unknown';
  userAction: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ServerErrorOptions {
  originalError?: Error;
  context?: ServerContext;
  userAction?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  additionalData?: Record<string, unknown>;
}

export class ServerError extends BaseError {
  public readonly serverContext?: ServerContext;
  public readonly userAction?: string;
  public readonly errorSeverity: ServerErrorOptions['severity'];

  constructor(
    message: string,
    options?: {
      code?: ServerErrorCode;
      originalError?: Error;
      context?: ServerContext;
      userAction?: string;
      severity?: ServerErrorOptions['severity'];
      additionalData?: Record<string, unknown>;
    }
  ) {
    super(message, options?.code ?? ErrorCodes.API_SERVER_ERROR, {
      originalError: options?.originalError,
      additionalData: {
        serverContext: options?.context,
        userAction: options?.userAction,
        severity: options?.severity || 'medium',
        processedAt: new Date(),
        ...options?.additionalData,
      },
      sentryContext: {
        tags: {
          serverSide: 'true',
          serverContext: options?.context || 'unknown',
          userSeverity: options?.severity || 'medium',
          errorHandler: 'server-error-class',
        },
      },
    });

    this.serverContext = options?.context;
    this.userAction = options?.userAction;
    this.errorSeverity = options?.severity || 'medium';

    // 서버 환경 메타데이터 추가
    this.metadata.isServerSide = true;

    // 컨텍스트별 메타데이터
    if (options?.context === 'server-action') {
      this.metadata.serverAction = true;
    } else if (options?.context === 'api-route') {
      this.metadata.apiRoute = true;
    }
  }

  getUserMessage(): string {
    const code = String(this.code);

    const userMessages: Record<string, string> = {
      // 네트워크 에러
      '3000': '인터넷 연결을 확인해주세요',
      '3001': '현재 오프라인 상태예요',
      '3002': '요청 시간이 초과되었어요',

      // TMDB API 에러
      '2102': '요청하신 영화를 찾을 수 없어요',
      '2103': '잠시만요, 요청이 너무 많아요',
      '2107': '영화 서비스에 일시적인 문제가 있어요',
      '2108': '영화 정보 로딩이 너무 오래 걸려요',

      // OpenAI API 에러
      '2201': 'AI 서비스 사용량이 초과되었어요',
      '2205': 'AI 서비스 한도에 도달했어요',

      // 일반 API 에러
      '2002': '접근 권한이 없어요',
      '2005': '서버에 일시적인 문제가 발생했어요',

      // 기본값
      '5000': '서버에서 예상치 못한 문제가 발생했어요',
    };

    return userMessages[code] || this.message || '일시적인 문제가 발생했어요';
  }

  getUserAction(): string {
    if (this.userAction) {
      return this.userAction;
    }

    const code = String(this.code);

    const actionGuides: Record<string, string> = {
      // 네트워크 에러
      '3000': '네트워크 연결을 확인하고 새로고침해 주세요',
      '3001': 'WiFi나 데이터 연결을 확인해 주세요',
      '3002': '잠시 후 다시 시도해 주세요',

      // TMDB API 에러
      '2102': '다른 영화를 검색해 보세요',
      '2103': '1-2분 후 다시 시도해 주세요',
      '2107': '고객센터에 문의하거나 잠시 후 다시 시도해 주세요',
      '2108': '페이지를 새로고침하거나 잠시 후 다시 시도해 주세요',

      // OpenAI API 에러
      '2201': 'AI 기능은 잠시 후 다시 이용해 주세요',
      '2205': 'AI 기능은 내일 다시 이용 가능해요',

      // 일반 API 에러
      '2002': '로그인 상태를 확인하거나 고객센터에 문의해 주세요',
      '2005': '고객센터(1588-0000)로 문의해 주세요',
    };

    return actionGuides[code] || '문제가 지속되면 고객센터에 문의해 주세요';
  }

  // 에러 심각도 반환
  getSeverity(): ServerErrorOptions['severity'] {
    return this.errorSeverity;
  }

  // 서버 컨텍스트 반환
  getServerContext(): ServerContext | undefined {
    return this.serverContext;
  }

  // 클라이언트에서 사용할 직렬화된 에러 정보
  toClientError(): ClientErrorResponse {
    return {
      message: this.getUserMessage(),
      code: String(this.code),
      kind: this.getErrorKind(),
      userAction: this.getUserAction(),
      severity: this.errorSeverity || 'medium',
    };
  }

  // 에러 종류 분류
  private getErrorKind(): 'network' | 'api' | 'client' | 'server' | 'unknown' {
    const code = this.code;

    if (code >= 3000 && code < 4000) return 'network';
    if (code >= 2000 && code < 3000) return 'api';
    if (code >= 4000 && code < 5000) return 'client';
    if (code >= 5000) return 'server';

    return 'unknown';
  }

  // 특정 컨텍스트에서 발생한 에러인지 확인
  isContext(context: ServerContext): boolean {
    return this.serverContext === context;
  }

  // 심각한 에러인지 확인
  isCritical(): boolean {
    return this.errorSeverity === 'critical';
  }

  // 서버 컴포넌트 에러 생성
  static serverComponent(
    message: string,
    originalError?: Error,
    options?: Omit<ServerErrorOptions, 'context'>
  ): ServerError {
    return new ServerError(message, {
      ...options,
      originalError,
      context: 'server-component',
    });
  }

  // 서버 액션 에러 생성
  static serverAction(
    message: string,
    originalError?: Error,
    options?: Omit<ServerErrorOptions, 'context'>
  ): ServerError {
    return new ServerError(message, {
      ...options,
      originalError,
      context: 'server-action',
    });
  }

  // API 라우트 에러 생성
  static apiRoute(
    message: string,
    originalError?: Error,
    options?: Omit<ServerErrorOptions, 'context'>
  ): ServerError {
    return new ServerError(message, {
      ...options,
      originalError,
      context: 'api-route',
    });
  }
}
