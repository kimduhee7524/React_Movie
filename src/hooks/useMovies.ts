import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import {
  GetSearchMoviesParams,
  GetMoviesParams,
  SearchMovieResponse,
  MovieResponse,
} from '@/types/movie';
import { movieQueries } from '@/queries/movieQueries';

export const useSuspensePopularMoviesInfinite = (
  params: GetMoviesParams,
  options?: {
    initialData?: {
      pages: MovieResponse[];
      pageParams: number[];
    };
  }
) => {
  return useSuspenseInfiniteQuery({
    ...movieQueries.popularInfinite(params.language || 'en-US'),
    ...options,
  });
};

export const useSearchMoviesInfinite = (
  params: GetSearchMoviesParams,
  options?: {
    initialData?: {
      pages: SearchMovieResponse[];
      pageParams: number[];
    };
  }
) => {
  return useSuspenseInfiniteQuery({
    ...movieQueries.searchInfinite({
      query: params.query,
      language: params.language || 'en-US',
    }),
    ...options,
  });
};
