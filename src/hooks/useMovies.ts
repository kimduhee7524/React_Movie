import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
  useQuery,
} from '@tanstack/react-query';
import {
  GetSearchMoviesParams,
  GetMoviesParams,
  MovieDetailType,
} from '@/types/movie';
import { movieQueries } from '@/queries/movieQueries';

export const useSuspensePopularMovies = (params: GetMoviesParams = {}) => {
  return useSuspenseQuery({
    ...movieQueries.popular(params),
    select: (data) => data.results,
  });
};

export const usePopularMovies = (params: GetMoviesParams = {}) => {
  return useQuery(movieQueries.popular(params));
};

export const usePopularMoviesInfinite = (language = 'en-US') => {
  return useSuspenseInfiniteQuery(movieQueries.popularInfinite(language));
};

export const useSearchMoviesInfinite = (params: GetSearchMoviesParams) => {
  return useSuspenseInfiniteQuery(
    movieQueries.searchInfinite({
      query: params.query,
      language: params.language || 'en-US',
    })
  );
};

export const useMovieDetail = (movieId: number, language = 'en-US') => {
  return useSuspenseQuery(movieQueries.detail(movieId, language));
};

export const useSearchMovies = (params: GetSearchMoviesParams) => {
  return useQuery(movieQueries.search(params));
};

export const useSuspenseAIMovieRecommendations = (movie: MovieDetailType) => {
  return useSuspenseQuery(movieQueries.aiRecommendations(movie));
};
