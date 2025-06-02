import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
  useQuery,
} from '@tanstack/react-query';
import { GetSearchMoviesParams, GetMoviesParams } from '@/types/movie';
import { queryKeys } from '@/types/queryKey';



// 개선된 훅들 - queryKeys 팩토리 사용
export const useSuspensePopularMovies = ({ page = 1, language = 'en-US' }: GetMoviesParams = {}) => {
  return useSuspenseQuery({...queryKeys.movie.popular({ page, language }), select: (data) => data.results});
};

export const usePopularMovies = ({ page = 1, language = 'en-US' }: GetMoviesParams = {}) => {
  return useQuery(queryKeys.movie.popular({ page, language }));
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
