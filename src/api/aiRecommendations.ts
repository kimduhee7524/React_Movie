import { callOpenAI } from './openaiClient';
import { MovieDetailType, AIRecommendation } from '@/types/movie';
import {
  buildPrimaryPrompt,
  buildFallbackPrompt,
  buildMovieReviewPrompt,
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
  const primaryResult = await callOpenAI(primaryPrompt);

  if (primaryResult?.trim()) {
    const validRecommendations = parsePrimaryResponse(primaryResult.trim());
    if (validRecommendations && validRecommendations.length > 0) {
      return validRecommendations.slice(0, LIMIT_PRIMARY);
    }
  }

  // 응답이 없거나 파싱 실패시 Fallback 시도
  const fallbackPrompt = buildFallbackPrompt(movie);
  const fallbackText = await callOpenAI(fallbackPrompt);

  // Fallback 응답 처리
  const genres = joinNames(movie.genres);
  const fallback = parseFallbackLines(fallbackText?.trim() || '', genres);

  return fallback.slice(0, LIMIT_FALLBACK);
};

export const getAIMovieReview = async (
  movie: MovieDetailType
): Promise<string> => {
  const reviewPrompt = buildMovieReviewPrompt(movie);
  const reviewResult = await callOpenAI(reviewPrompt);

  return reviewResult?.trim() || '';
};
