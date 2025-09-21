import { MovieDetailType } from '@/types/movie';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { movieQueries } from '@/queries/movieQueries';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/share/ErrorFallback';
import AIRecommendationsData from './AIRecommendationsData';
import AIRecommendationsLoadingSkeleton from '@/components/skeleton/AIRecommendationsLoadingSkeleton';

interface MovieAIRecommendationsContentProps {
  movie: MovieDetailType;
}

export default function MovieAIRecommendationsContent({
  movie,
}: MovieAIRecommendationsContentProps) {
  const queryClient = useQueryClient();

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">AI 영화 추천</h3>
            <p className="text-sm text-muted-foreground">
              이 영화를 좋아한다면 다음 영화들도 추천해요
            </p>
          </div>
        </div>
      </div>

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
