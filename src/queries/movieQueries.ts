import { infiniteQueryOptions } from '@tanstack/react-query';
import { getPopularMovies, getSearchMovies } from '@/api/movies';
import {
  GetSearchMoviesParams,
  SearchMovieResponse,
  MovieResponse,
} from '@/types/movie';

export const movieQueries = {
  keys: {
    all: ['movies'] as const,
    lists: () => [...movieQueries.keys.all, 'list'] as const,
    list: (filters: string) =>
      [...movieQueries.keys.lists(), { filters }] as const,
    details: () => [...movieQueries.keys.all, 'detail'] as const,
    detail: (id: number, language?: string) =>
      [...movieQueries.keys.details(), id, { language }] as const,
  },

  // 인기 영화 무한스크롤
  popularInfinite: (language = 'en-US') =>
    infiniteQueryOptions<MovieResponse, Error>({
      queryKey: [
        ...movieQueries.keys.lists(),
        'popular-infinite',
        { language },
      ],
      queryFn: ({ pageParam = 1 }) =>
        getPopularMovies({ page: pageParam as number, language }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const next = lastPage.page + 1;
        return next <= lastPage.total_pages ? next : undefined;
      },
      staleTime: 60 * 1000,
    }),

  // 검색 무한스크롤
  searchInfinite: (params: Pick<GetSearchMoviesParams, 'query' | 'language'>) =>
    infiniteQueryOptions<SearchMovieResponse, Error>({
      queryKey: [...movieQueries.keys.lists(), 'search-infinite', params],
      queryFn: ({ pageParam = 1 }) =>
        getSearchMovies({ ...params, page: pageParam as number }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const next = lastPage.page + 1;
        return next <= lastPage.total_pages ? next : undefined;
      },
      enabled: !!params.query?.trim(), // 쿼리가 있을 때만 실행
      staleTime: 1000 * 60 * 3,
    }),
};
