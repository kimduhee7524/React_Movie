import { queryOptions, infiniteQueryOptions } from '@tanstack/react-query';
import {
  getPopularMovies,
  getSearchMovies,
  getMovieDetail,
} from '@/api/movies';
import {
  getAIMovieRecommendations,
  getAIMovieReview,
} from '@/api/aiRecommendations';
import {
  GetSearchMoviesParams,
  SearchMovieResponse,
  GetMoviesParams,
  MovieResponse,
  MovieDetailType,
  AIRecommendation,
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
    aiRecommendations: (movieId: number) =>
      [...movieQueries.keys.all, 'ai-recommendations', movieId] as const,
    aiReview: (movieId: number) =>
      [...movieQueries.keys.all, 'ai-review', movieId] as const,
  },

  // 인기 영화 쿼리
  popular: (params: GetMoviesParams = {}) =>
    queryOptions<MovieResponse, Error>({
      queryKey: movieQueries.keys.list(
        `popular-${params.language || 'en-US'}-${params.page || 1}`
      ),
      queryFn: () => getPopularMovies(params),
      staleTime: 0,
    }),

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
      staleTime: 0,
    }),

  // 영화 검색
  search: (params: GetSearchMoviesParams) =>
    queryOptions<SearchMovieResponse, Error>({
      queryKey: [...movieQueries.keys.lists(), 'search', params],
      queryFn: () => getSearchMovies(params),
      enabled: !!params.query?.trim(), // 쿼리가 있을 때만 실행
      staleTime: 1000 * 60 * 5,
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

  // 영화 상세정보
  detail: (movieId: number, language = 'en-US') =>
    queryOptions<MovieDetailType, Error>({
      queryKey: movieQueries.keys.detail(movieId, language),
      queryFn: () => getMovieDetail(movieId, language),
      staleTime: 0,
    }),

  // AI 영화 추천
  aiRecommendations: (movie: MovieDetailType) =>
    queryOptions<AIRecommendation[], Error>({
      queryKey: movieQueries.keys.aiRecommendations(movie.id),
      queryFn: () => getAIMovieRecommendations(movie),
      staleTime: 0,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }),

  // AI 영화 리뷰
  aiReview: (movie: MovieDetailType) =>
    queryOptions<string, Error>({
      queryKey: movieQueries.keys.aiReview(movie.id),
      queryFn: () => getAIMovieReview(movie),
      staleTime: 0,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }),
};
