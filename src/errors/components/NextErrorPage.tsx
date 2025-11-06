'use client';

import { ArrowLeft, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BaseError } from '../types/BaseError';
import { getErrorContent, normalizeError, classifyError } from '../index';

interface NextErrorPageProps {
  error: (Error & { digest?: string }) | BaseError;
  reset?: () => void;
  statusCode?: number;
}

export function NextErrorPage({
  error,
  reset,
  statusCode,
}: NextErrorPageProps) {
  const router = useRouter();

  // 에러 정규화
  const normalizedError = normalizeError(error);
  const errorContent = getErrorContent(normalizedError);

  const handleGoHome = () => router.push('/');
  const handleGoBack = () => router.back();
  const handleRefresh = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 에러 아이콘 */}
        <div className="text-6xl">{errorContent.icon}</div>

        {/* 에러 정보 */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {errorContent.title}
          </h1>
          <p className="text-muted-foreground">{errorContent.description}</p>

          {/* 개발 환경에서 상세 에러 메시지 표시 */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-3 bg-muted rounded-md text-left text-sm">
              <summary className="cursor-pointer font-medium">
                개발자 정보
              </summary>
              <div className="mt-2 space-y-1">
                <p>
                  <strong>에러:</strong> {normalizedError.message}
                </p>
                <p>
                  <strong>코드:</strong> {normalizedError.code}
                </p>
                <p>
                  <strong>종류:</strong> {classifyError(normalizedError)}
                </p>
                {'digest' in error && error.digest && (
                  <p>
                    <strong>Next.js Digest:</strong> {error.digest}
                  </p>
                )}
                {statusCode && (
                  <p>
                    <strong>Status Code:</strong> {statusCode}
                  </p>
                )}
                <p>
                  <strong>타임스탬프:</strong>{' '}
                  {normalizedError.metadata.timestamp.toLocaleString()}
                </p>
                {normalizedError.metadata.url && (
                  <p>
                    <strong>URL:</strong> {normalizedError.metadata.url}
                  </p>
                )}
              </div>
            </details>
          )}
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <RefreshCw size={16} />
            {errorContent.actionLabel}
          </button>

          <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
          >
            <ArrowLeft size={16} />
            뒤로가기
          </button>

          <button
            onClick={handleGoHome}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
          >
            <Home size={16} />
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
