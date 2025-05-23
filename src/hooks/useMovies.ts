import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { getPopularMovies, getSearchMovies } from '@/services/movieApi';
import { GetSearchMoviesParams, SearchMovieResponse } from '@/types/movie';

export const usePopularMovies = ({ page = 1, language = 'en-US' }) => {
  return useSuspenseQuery({
    queryKey: ['popularMovies', { page, language }],
    queryFn: () => getPopularMovies({ page, language }),
  });
};

export const usePopularMoviesInfinite = (language = 'en-US') => {
  return useSuspenseInfiniteQuery({
    queryKey: ['popular-movies', language],
    queryFn: ({ pageParam = 1 }) =>
      getPopularMovies({ page: pageParam, language }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const next = lastPage.page + 1;
      return next <= lastPage.total_pages ? next : undefined;
    },
  });
};

export const useSearchMoviesInfinite = ({
  query,
  language = 'en-US',
}: GetSearchMoviesParams) => {
  return useSuspenseInfiniteQuery<SearchMovieResponse, Error>({
    queryKey: ['search-movies', { query, language }],
    queryFn: ({ pageParam = 1 }) =>
      getSearchMovies({ query, language, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const next = lastPage.page + 1;
      return next <= lastPage.total_pages ? next : undefined;
    },
  });
};
