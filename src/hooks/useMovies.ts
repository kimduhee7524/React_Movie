import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
  queryOptions,
  infiniteQueryOptions,
} from '@tanstack/react-query';
import { getPopularMovies, getSearchMovies } from '@/services/movieApi';
import { GetSearchMoviesParams, SearchMovieResponse, GetMoviesParams } from '@/types/movie';

// 쿼리키 팩토리 정의
export const queryKeys = {
  movie: {
    all: ['movie'] as const,
    popular: (params: GetMoviesParams) =>
      queryOptions({
        queryKey: [...queryKeys.movie.all, 'popular', params],
        queryFn: () => getPopularMovies(params),
      }),
    popularInfinite: (language = 'en-US') =>
      infiniteQueryOptions({
        queryKey: [...queryKeys.movie.all, 'popular-infinite', language],
        queryFn: ({ pageParam = 1 }) =>
          getPopularMovies({ page: pageParam, language }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const next = lastPage.page + 1;
          return next <= lastPage.total_pages ? next : undefined;
        },
      }),
    search: (params: GetSearchMoviesParams) =>
      queryOptions({
        queryKey: [...queryKeys.movie.all, 'search', params],
        queryFn: () => getSearchMovies(params),
      }),
    searchInfinite: (params: Pick<GetSearchMoviesParams, 'query' | 'language'>) =>
      infiniteQueryOptions<SearchMovieResponse, Error>({
        queryKey: [...queryKeys.movie.all, 'search-infinite', params],
        queryFn: ({ pageParam = 1 }) =>
          getSearchMovies({ ...params, page: pageParam as number }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          const next = lastPage.page + 1;
          return next <= lastPage.total_pages ? next : undefined;
        },
      }),
  },
};

// 개선된 훅들 - queryKeys 팩토리 사용
export const usePopularMovies = ({ page = 1, language = 'en-US' }: GetMoviesParams = {}) => {
  return useSuspenseQuery(queryKeys.movie.popular({ page, language }));
};

export const usePopularMoviesInfinite = (language = 'en-US') => {
  return useSuspenseInfiniteQuery(queryKeys.movie.popularInfinite(language));
};

export const useSearchMoviesInfinite = ({
  query,
  language = 'en-US',
}: GetSearchMoviesParams) => {
  return useSuspenseInfiniteQuery(queryKeys.movie.searchInfinite({ query, language }));
};
