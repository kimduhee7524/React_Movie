import { callOpenAI } from './openai';
import { MovieDetailType, AIRecommendation } from '@/types/movie';
import {
  buildPrimaryPrompt,
  buildFallbackPrompt,
} from '@/utils/promptBuilders';
import {
  parsePrimaryResponse,
  parseFallbackLines,
  joinNames,
} from '@/utils/responseParser';

export const LIMIT_PRIMARY = 5;
export const LIMIT_FALLBACK = 3;

export const getAIMovieRecommendations = async (
  movie: MovieDetailType
): Promise<AIRecommendation[]> => {
  const primaryPrompt = buildPrimaryPrompt(movie);

  const primaryResult = await callOpenAI(primaryPrompt)
    .then((res) => res?.trim())
    .catch(() => null);

  if (primaryResult) {
    const validRecommendations = parsePrimaryResponse(primaryResult);
    if (validRecommendations) {
      console.log(primaryResult);
      return validRecommendations.slice(0, LIMIT_PRIMARY);
    }
  }

  const fallbackPrompt = buildFallbackPrompt(movie);
  const fallbackText = await callOpenAI(fallbackPrompt)
    .then((res) => res?.trim())
    .catch(() => null);

  if (!fallbackText) {
    throw new Error('AI 추천을 생성할 수 없습니다.');
  }

  const genres = joinNames(movie.genres);
  const fallback = parseFallbackLines(fallbackText, genres);
  return fallback.slice(0, LIMIT_FALLBACK);
};
