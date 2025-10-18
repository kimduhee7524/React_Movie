/**
 * 공통 에러 페이지
 * ErrorFallback 컴포넌트를 전체 화면으로 래핑
 */

import { BaseError } from '@/errors';
import ErrorFallback from '@/components/share/ErrorFallback';

interface ErrorFallbackPageProps {
  error: BaseError;
  onRetry?: () => void;
}

export default function ErrorFallbackPage({
  error,
  onRetry,
}: ErrorFallbackPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <ErrorFallback error={error} resetErrorBoundary={onRetry} />
    </div>
  );
}
