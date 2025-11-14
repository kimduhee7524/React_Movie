import PageLayout from '@/layouts/PageLayout';
import PopularMoviesScrollVirtual from '@/components/movie/list/PopularMoviesScrollVirtual';
import MoviesSkeleton from '@/components/skeleton/MoviesSkeleton';
import { Suspense } from 'react';
import { HydrationBoundary } from '@/components/HydrationBoundary';
import { createServerQueryClient } from '@/utils/serverPrefetch';
import { movieQueries } from '@/queries/movieQueries';
import { dehydrate } from '@tanstack/react-query';

export default async function HomePage() {
  // 서버에서 데이터 프리패칭 - 클라이언트와 동일한 쿼리 사용
  const queryClient = createServerQueryClient();
  await queryClient.prefetchInfiniteQuery(
    movieQueries.popularInfinite('ko-KR')
  );

  // 클라이언트로 전달할 데이터 준비
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PageLayout title="인기 영화">
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
              <MoviesSkeleton count={12} />
            </div>
          }
        >
          {/* 기존 useSuspenseQuery 그대로 사용 - 하이드레이션 시점에 즉시 데이터 사용 */}
          <PopularMoviesScrollVirtual />
        </Suspense>
      </PageLayout>
    </HydrationBoundary>
  );
}
