import { useParams } from 'react-router-dom';
import { Suspense } from 'react';
import BackButton from '@/components/share/BackButton';
import AIHeader from '@/components/share/AIHeader';
import AIReviewContent from '@/components/movie/detail/AIReviewContent';
import { useNavigate } from 'react-router-dom';

export default function AIReviewPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();

  const movieIdNumber = movieId ? parseInt(movieId, 10) : 0;

  const handleGoBack = () => {
    navigate(`/movie/${movieId}`, {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BackButton onClick={handleGoBack} />

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
  );
}
