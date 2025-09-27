import { MovieDetailType } from '@/types/movie';
import { joinNames } from './responseParser';

export const buildPrimaryPrompt = (movie: MovieDetailType): string => {
  const genres = joinNames(movie.genres);
  const companies = joinNames(movie.production_companies, 3);

  return `
역할: 
당신은 세계적인 영화 평론가이자 관객을 사로잡는 영화 큐레이터입니다. 
추천 이유(reason)는 단순 줄거리 소개가 아니라, 작품의 연출, 서사, 배우의 연기, 장르적 매력 등을 관객이 영화를 보고 싶어지도록 흥미와 설득력을 담아 작성하세요. 
스타일은 영화 잡지 리뷰나 예고편 카피처럼 전문적이면서 매력적으로 표현하세요.

"${movie.title}" 영화를 좋아하는 사람에게 추천할 만한 영화 5편을 제안해주세요.

현재 영화 정보:
- 제목: ${movie.title}
- 장르: ${genres}
- 평점: ${movie.vote_average}/10 (${movie.vote_count}명 평가)
- 개봉일: ${movie.release_date}
- 러닝타임: ${movie.runtime}분
- 제작사: ${companies}
- 줄거리: ${movie.overview}

출력 형식
반드시 다음 JSON 형식으로, 정확히 5개의 추천 영화를 출력하세요:

[
  {
    "title": "영화 제목",
    "reason": "관객의 흥미를 끌 수 있는 전문가적인 추천 이유 (300자 이내)",
    "genre": "주요 장르",
    "rating": "예상 평점대 (예: 8.5/10)"
  }
]

규칙:
- 실존하는 유명한 영화만 추천
- 한국어로 작성
- JSON 외 다른 텍스트 금지
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
