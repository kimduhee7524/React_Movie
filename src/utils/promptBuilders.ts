import { MovieDetailType } from '@/types/movie';
import { joinNames } from './responseParser';

export const buildPrimaryPrompt = (movie: MovieDetailType): string => {
  const genres = joinNames(movie.genres);
  const companies = joinNames(movie.production_companies, 3);

  return `
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
`.trim();
};

/** 폴백용 단순 형식 프롬프트 생성 */
export const buildFallbackPrompt = (movie: MovieDetailType): string => {
  const genres = joinNames(movie.genres);
  return `
"${movie.title}" (${genres}) 영화를 좋아하는 사람에게 추천할 영화 3개를 다음 형식으로 알려주세요:
1. 영화제목 - 추천이유
2. 영화제목 - 추천이유
3. 영화제목 - 추천이유
간단하고 명확하게 작성해주세요.
`.trim();
};
