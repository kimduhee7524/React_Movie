import { useSuspenseAIMovieRecommendations } from '@/hooks/useMovies';
import { MovieDetailType } from '@/types/movie';

interface AIRecommendationsDataProps {
  movie: MovieDetailType;
}

export default function AIRecommendationsData({
  movie,
}: AIRecommendationsDataProps) {
  const { data: recommendations } = useSuspenseAIMovieRecommendations(movie);

  return (
    <>
      {recommendations && recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="group p-4 bg-gradient-to-r from-accent/5 to-transparent 
                         rounded-lg border-l-4 border-accent/50 hover:border-accent 
                         transition-all duration-300 hover:bg-accent/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                      {rec.title}
                    </h4>
                    {rec.rating && (
                      <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                        ⭐ {rec.rating}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {rec.reason}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                      {rec.genre}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* AI 추천 정보 */}
          <div className="mt-6 p-3 bg-muted/30 rounded-lg border border-border/30">
            <p className="text-xs text-muted-foreground text-center">
              🤖 이 추천은 AI가 "{movie.title}"의 장르, 줄거리, 평점을 분석하여
              생성했습니다
            </p>
          </div>
        </div>
      ) : (
        // 추천 결과가 없을 때
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-4xl mb-4">🤔</div>
          <p>이 영화에 대한 추천을 생성할 수 없었습니다.</p>
        </div>
      )}
    </>
  );
}
