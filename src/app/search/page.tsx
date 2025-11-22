'use client';

import PageLayout from '@/layouts/PageLayout';
import MoviesSkeleton from '@/components/skeleton/MoviesSkeleton';
import { Suspense } from 'react';
import SearchMovie from '@/components/movie/SearchMovie';

export default function SearchPage() {
  return (
    <PageLayout title="검색 결과">
      <Suspense
        fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
            <MoviesSkeleton count={12} />
          </div>
        }
      >
        <SearchMovie />
      </Suspense>
    </PageLayout>
  );
}
