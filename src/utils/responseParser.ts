import { AIRecommendation } from '@/types/movie';

/** ====== 응답 파싱 유틸리티 함수들 ====== */

/** 안전한 문자열 조립 */
export const joinNames = (arr: { name: string }[] = [], max?: number): string =>
  (max ? arr.slice(0, max) : arr).map((x) => x.name).join(', ');

/** 응답에서 JSON 덩어리만 추출 */
const extractJsonArray = (text: string): string | null => {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1 || end <= start) return null;
  return text.slice(start, end + 1).trim();
};

/** 안전한 JSON 파싱 */
const safeJsonParse = <T>(jsonString: string): T | null => {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
};

/** 추천 결과 유효성 검증 */
const validateRecommendations = (data: unknown): AIRecommendation[] => {
  if (!Array.isArray(data)) {
    throw new Error('추천 결과가 배열이 아닙니다.');
  }

  const validRecommendations = data.filter((item): item is AIRecommendation => {
    return (
      typeof item === 'object' &&
      item !== null &&
      typeof item.title === 'string' &&
      typeof item.reason === 'string' &&
      typeof item.genre === 'string' &&
      item.title.trim().length > 0 &&
      item.reason.trim().length > 0
    );
  });

  if (validRecommendations.length === 0) {
    throw new Error('유효한 추천 결과가 없습니다.');
  }

  return validRecommendations;
};

/** ====== 응답 파싱 함수들 ====== */

/** 메인 JSON 응답 파싱 */
export const parsePrimaryResponse = (
  response: string
): AIRecommendation[] | null => {
  const cleanResponse = response.trim();
  const jsonSlice = extractJsonArray(cleanResponse);

  if (!jsonSlice) return null;

  const parsed = safeJsonParse<AIRecommendation[]>(jsonSlice);
  if (!parsed) return null;

  try {
    return validateRecommendations(parsed);
  } catch {
    return null;
  }
};

/** 폴백 문자열 파싱 -> 구조화 */
export const parseFallbackLines = (
  text: string,
  primaryGenre: string
): AIRecommendation[] => {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const firstGenre = primaryGenre.split(',')[0]?.trim() || '드라마';

  const items = lines
    .map((line) => {
      const match = line.match(/^\d+\.\s*(.+?)\s*-\s*(.+)$/);
      if (!match) return null;
      return {
        title: match[1].trim(),
        reason: match[2].trim(),
        genre: '추천 영화',
      } as AIRecommendation;
    })
    .filter(Boolean) as AIRecommendation[];

  if (items.length > 0) return items.slice(0, 3);

  // 최소한의 가드
  return Array.from({ length: 3 }, (_, i) => ({
    title: `추천 영화 ${i + 1}`,
    reason: '비슷한 장르의 인기 영화입니다.',
    genre: firstGenre,
  }));
};
