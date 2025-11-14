import { Suspense } from 'react';
import BackButton from '@/components/share/BackButton';
import MovieDetailContent from '@/components/movie/detail/MovieDetailContent';
import MovieDetailSkeleton from '@/components/skeleton/MovieDetailSkeleton';
import { HydrationBoundary } from '@/components/HydrationBoundary';
import { createServerQueryClient } from '@/utils/serverPrefetch';
import { movieQueries } from '@/queries/movieQueries';
import { dehydrate } from '@tanstack/react-query';

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({
  params,
}: MovieDetailPageProps) {
  const { id } = await params;
  const movieId = parseInt(id || '0');

  // 서버에서 영화 상세 정보 프리패칭
  const queryClient = createServerQueryClient();
  await queryClient.prefetchQuery(movieQueries.detail(movieId, 'ko-KR'));

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="min-h-screen bg-background text-foreground">
        <BackButton to="/" />

        <Suspense fallback={<MovieDetailSkeleton />}>
          <MovieDetailContent movieId={movieId} />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}
