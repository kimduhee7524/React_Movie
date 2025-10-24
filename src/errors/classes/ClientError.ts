import { BaseError } from '../types/BaseError';
import { ErrorCodes } from '../types/errorCodes';

export class ClientError extends BaseError {
  constructor(
    message: string,
    options?: {
      code?: (typeof ErrorCodes)[keyof Pick<
        typeof ErrorCodes,
        | 'RENDER_ERROR'
        | 'COMPONENT_MOUNT_ERROR'
        | 'COMPONENT_UPDATE_ERROR'
        | 'COMPONENT_UNMOUNT_ERROR'
        | 'HOOK_ERROR'
        | 'SUSPENSE_ERROR'
        | 'LAZY_LOAD_ERROR'
      >];
      originalError?: Error;
      componentName?: string;
      componentStack?: string;
      additionalData?: Record<string, unknown>;
    }
  ) {
    super(message, options?.code ?? ErrorCodes.RENDER_ERROR, {
      originalError: options?.originalError,
      additionalData: {
        componentName: options?.componentName,
        ...options?.additionalData,
      },
      sentryContext: {
        tags: {
          componentName: options?.componentName ?? 'unknown',
        },
      },
    });

    // 컴포넌트 스택 추가
    if (options?.componentStack) {
      this.metadata.componentStack = options.componentStack;
    }
  }

  getUserMessage(): string {
    switch (this.code) {
      case ErrorCodes.COMPONENT_MOUNT_ERROR:
        return '컴포넌트를 불러오는 중 문제가 발생했습니다.';
      case ErrorCodes.COMPONENT_UPDATE_ERROR:
        return '컴포넌트를 업데이트하는 중 문제가 발생했습니다.';
      case ErrorCodes.HOOK_ERROR:
        return '데이터를 처리하는 중 문제가 발생했습니다.';
      case ErrorCodes.LAZY_LOAD_ERROR:
        return '페이지를 불러오는 중 문제가 발생했습니다. 새로고침 해주세요.';

      default:
        return '클라이언트에서 문제가 발생했습니다.';
    }
  }

  // 컴포넌트 마운트 에러 생성
  static componentMount(
    componentName: string,
    originalError: Error
  ): ClientError {
    return new ClientError(`Component mount failed: ${componentName}`, {
      code: ErrorCodes.COMPONENT_MOUNT_ERROR,
      originalError,
      componentName,
    });
  }

  // Hook 에러 생성
  static hook(
    hookName: string,
    originalError: Error,
    componentName?: string
  ): ClientError {
    return new ClientError(
      `Hook error in ${hookName}${componentName ? ` (${componentName})` : ''}`,
      {
        code: ErrorCodes.HOOK_ERROR,
        originalError,
        componentName,
        additionalData: { hookName },
      }
    );
  }

  // Lazy load 에러 생성
  static lazyLoad(moduleName: string, originalError: Error): ClientError {
    return new ClientError(`Failed to lazy load module: ${moduleName}`, {
      code: ErrorCodes.LAZY_LOAD_ERROR,
      originalError,
      additionalData: { moduleName },
    });
  }
}
