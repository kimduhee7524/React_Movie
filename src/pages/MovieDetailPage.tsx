import { useParams } from 'react-router-dom';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/share/ErrorFallback';
import MovieDetailBackButton from '@/components/movie/detail/MovieDetailBackButton';
import MovieDetailContent from '@/components/movie/detail/MovieDetailContent';
import MovieDetailSkeleton from '@/components/skeleton/MovieDetailSkeleton';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || '0');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MovieDetailBackButton />

      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div className="min-h-screen flex items-center justify-center">
            <ErrorFallback
              error={error}
              resetErrorBoundary={resetErrorBoundary}
            />
          </div>
        )}
      >
        <Suspense fallback={<MovieDetailSkeleton />}>
          <MovieDetailContent movieId={movieId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
