'use client';

import { Component, ReactNode } from 'react';
import { BaseError } from '../types/BaseError';
import { normalizeError } from '../errorNormalize';
import { handleReactError } from '../errorHandlers';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: BaseError, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  enableAutoRedirect?: boolean; // 자동 리다이렉트
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: BaseError | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const normalizedError =
      error instanceof BaseError ? error : normalizeError(error);

    return {
      hasError: true,
      error: normalizedError,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    handleReactError(error, errorInfo);

    this.props.onError?.(error, errorInfo);

    if (this.props.enableAutoRedirect) {
      const redirectTo = this.state.error?.metadata.redirectTo;
      if (redirectTo) {
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 2000);
      }
    }
  }

  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // 커스텀 fallback이 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetErrorBoundary);
      }

      // 기본 에러 메시지
      return (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              오류가 발생했습니다
            </h2>
            <p className="text-gray-600 mb-4">{this.state.error.message}</p>
            <button
              onClick={this.resetErrorBoundary}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
