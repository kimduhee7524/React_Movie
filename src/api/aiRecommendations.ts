import { callOpenAI } from './openai';
import { MovieDetailType } from '@/types/movie';

export interface AIRecommendation {
  title: string;
  reason: string;
  genre: string;
  rating?: string;
}

// 영화 데이터를 바탕으로 AI 추천을 받는 함수

export const getAIMovieRecommendations = async (
  movie: MovieDetailType
): Promise<AIRecommendation[]> => {
  const genres = movie.genres.map((g) => g.name).join(', ');
  const companies = movie.production_companies
    .slice(0, 3)
    .map((c) => c.name)
    .join(', ');

  const prompt = `
영화 "${movie.title}"을 좋아하는 사람에게 추천할 만한 영화 5개를 추천해주세요.

현재 영화 정보:
- 제목: ${movie.title}
- 장르: ${genres}
- 평점: ${movie.vote_average}/10 (${movie.vote_count}명 평가)
- 개봉일: ${movie.release_date}
- 러닝타임: ${movie.runtime}분
- 제작사: ${companies}
- 줄거리: ${movie.overview}

다음 JSON 형식으로 정확히 5개의 영화를 추천해주세요:
[
  {
    "title": "영화 제목",
    "reason": "추천 이유 (한 문장으로)",
    "genre": "주요 장르",
    "rating": "예상 평점대 (예: 8.5/10)"
  }
]

실존하는 유명한 영화들로만 추천해주시고, 한국어로 작성해주세요.
JSON 형식만 반환하고 다른 텍스트는 포함하지 마세요.
`;

  try {
    const response = await callOpenAI(prompt);

    // JSON 파싱 시도
    const cleanResponse = response.trim();
    const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error('유효한 JSON 형식을 찾을 수 없습니다.');
    }

    const recommendations: AIRecommendation[] = JSON.parse(jsonMatch[0]);

    // 유효성 검증
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
      throw new Error('추천 결과가 올바르지 않습니다.');
    }

    return recommendations.slice(0, 5); // 최대 5개만 반환
  } catch (error) {
    console.error('AI 추천 파싱 실패:', error);

    // 폴백: 더 간단한 형식으로 재시도
    const fallbackPrompt = `
"${movie.title}" (${genres}) 영화를 좋아하는 사람에게 추천할 영화 3개를 다음 형식으로 알려주세요:

1. 영화제목 - 추천이유
2. 영화제목 - 추천이유  
3. 영화제목 - 추천이유

간단하고 명확하게 작성해주세요.
`;

    try {
      const fallbackResponse = await callOpenAI(fallbackPrompt);
      const lines = fallbackResponse.split('\n').filter((line) => line.trim());

      const fallbackRecommendations: AIRecommendation[] = lines
        .slice(0, 3)
        .map((line, index) => {
          const match = line.match(/^\d+\.\s*(.+?)\s*-\s*(.+)$/);
          if (match) {
            return {
              title: match[1].trim(),
              reason: match[2].trim(),
              genre: '추천 영화',
              rating: undefined,
            };
          }
          return {
            title: `추천 영화 ${index + 1}`,
            reason: '비슷한 장르의 인기 영화입니다.',
            genre: genres.split(',')[0] || '드라마',
            rating: undefined,
          };
        });

      return fallbackRecommendations;
    } catch (fallbackError) {
      console.error('폴백 추천도 실패:', fallbackError);
      throw new Error('AI 추천을 생성할 수 없습니다.');
    }
  }
};
