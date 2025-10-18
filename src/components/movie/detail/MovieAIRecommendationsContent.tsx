import { MovieDetailType } from '@/types/movie';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/share/ErrorFallback';
import AIHeader from '@/components/share/AIHeader';
import AIRecommendationsData from './AIRecommendationsData';
import AIRecommendationsLoadingSkeleton from '@/components/skeleton/AIRecommendationsLoadingSkeleton';

interface MovieAIRecommendationsContentProps {
  movie: MovieDetailType;
}

export default function MovieAIRecommendationsContent({
  movie,
}: MovieAIRecommendationsContentProps) {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
      <AIHeader
        title="AI 영화 추천"
        description="이 영화를 좋아한다면 다음 영화들도 추천해요"
      />

      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback
            error={error}
            resetErrorBoundary={resetErrorBoundary}
            title="AI 추천 로딩 실패"
            description="AI 추천을 불러오는 중 오류가 발생했습니다."
          />
        )}
      >
        <Suspense fallback={<AIRecommendationsLoadingSkeleton />}>
          <AIRecommendationsData movie={movie} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
