import PageLayout from '@/layouts/PageLayout';
import MoviesSkeleton from '@/components/skeleton/MoviesSkeleton';
import { Suspense } from 'react';
import SearchMovie from '@/components/movie/SearchMovie';
import { HydrationBoundary } from '@/components/HydrationBoundary';
import { createServerQueryClient } from '@/utils/serverPrefetch';
import { movieQueries } from '@/queries/movieQueries';
import { dehydrate } from '@tanstack/react-query';

interface SearchPageProps {
  searchParams?: { query?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.query?.trim() || '';

  // 서버에서 검색 결과 프리패칭
  const queryClient = createServerQueryClient();

  // 검색어가 있을 때만 프리패칭
  if (query) {
    await queryClient.prefetchInfiniteQuery(
      movieQueries.searchInfinite({ query, language: 'ko-KR' })
    );
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PageLayout title={query ? `"${query}" 검색 결과` : '검색 결과'}>
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
    </HydrationBoundary>
  );
}
