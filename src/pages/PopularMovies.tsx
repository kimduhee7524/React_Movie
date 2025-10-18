import PageLayout from '@/layouts/PageLayout';
import PopularMoviesScrollVirtual from '@/components/movie/list/PopularMoviesScrollVirtual';
import MoviesSkeleton from '@/components/skeleton/MoviesSkeleton';
import { Suspense } from 'react';

export default function PopularMovies() {
  return (
    <PageLayout title="인기 영화">
      <Suspense
        fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            <MoviesSkeleton />
          </div>
        }
      >
        <PopularMoviesScrollVirtual />
      </Suspense>
    </PageLayout>
  );
}
