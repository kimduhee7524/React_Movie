import { MovieDetailType } from '@/types/movie';
import { getAIMovieRecommendations } from '@/api/aiRecommendations';
import AIHeader from '@/components/share/AIHeader';
import AIRecommendationsData from './AIRecommendationsData';

interface MovieAIRecommendationsContentProps {
  movie: MovieDetailType;
}

export default async function MovieAIRecommendationsContent({
  movie,
}: MovieAIRecommendationsContentProps) {
  const recommendations = await getAIMovieRecommendations(movie);

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
      <AIHeader
        title="AI 영화 추천"
        description="이 영화를 좋아한다면 다음 영화들도 추천해요"
      />

      <AIRecommendationsData recommendations={recommendations} />
    </div>
  );
}
