import { Suspense } from 'react';
import BackButton from '@/components/share/BackButton';
import AIHeader from '@/components/share/AIHeader';
import AIReviewContent from '@/components/movie/detail/AIReviewContent';
import { HydrationBoundary } from '@/components/HydrationBoundary';
import { createServerQueryClient } from '@/utils/serverPrefetch';
import { movieQueries } from '@/queries/movieQueries';
import { dehydrate } from '@tanstack/react-query';

interface AIReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function AIReviewPage({ params }: AIReviewPageProps) {
  const { id } = await params;
  const movieIdNumber = id ? parseInt(id, 10) : 0;

  // 서버에서 AI 리뷰 관련 데이터 프리패칭
  const queryClient = createServerQueryClient();

  // 영화 상세 정보 먼저 가져오기
  await queryClient.prefetchQuery(movieQueries.detail(movieIdNumber, 'ko-KR'));

  //  영화 정보를 사용해서 AI 리뷰 프리패칭
  const movieData = queryClient.getQueryData(
    movieQueries.detail(movieIdNumber, 'ko-KR').queryKey
  );
  if (movieData) {
    await queryClient.prefetchQuery(movieQueries.aiReview(movieData));
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="min-h-screen bg-background text-foreground">
        <BackButton to={`/movie/${id}`} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/50">
            <AIHeader
              title="AI 전문가 리뷰"
              description="AI가 분석한 이 영화의 매력 포인트"
              className="flex items-center gap-3 mb-6"
            />

            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-lg">
                    <div className="w-6 h-6 bg-purple-400 rounded-full animate-spin" />
                    <span>AI가 리뷰를 작성하고 있습니다...</span>
                  </div>
                </div>
              }
            >
              <AIReviewContent movieId={movieIdNumber} />
            </Suspense>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
