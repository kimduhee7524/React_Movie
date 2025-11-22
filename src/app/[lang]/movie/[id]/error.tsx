'use client';

import { useEffect } from 'react';
import { handleError } from '@/errors';
import BackButton from '@/components/share/BackButton';

export default function MovieDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    handleError(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <BackButton to="/" className="mb-6" />

        <div className="text-6xl mb-6">🎬</div>
        <h2 className="text-2xl font-bold mb-4">영화를 불러올 수 없어요</h2>
        <p className="text-muted-foreground mb-6">
          영화 정보를 가져오는 중 문제가 발생했습니다.
        </p>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            다시 시도
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            이전 페이지로
          </button>
        </div>
      </div>
    </div>
  );
}
