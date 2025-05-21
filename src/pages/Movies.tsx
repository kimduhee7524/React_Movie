import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import PopularMovies from "@/components/movie/PopularMovies";
import MoviesSkeleton from "@/components/skeleton/MoviesSkeleton";
import ErrorFallback from "@/components/share/ErrorFallback";
import PageLayout from "@/layouts/PageLayout";

const MoviesPage = () => {
  return (
    <PageLayout title="인기 영화 (Pagination)">
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback
            error={error}
            resetErrorBoundary={resetErrorBoundary}
          />
        )}
      >
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              <MoviesSkeleton />
            </div>
          }
        >
          <PopularMovies />
        </Suspense>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default MoviesPage;
