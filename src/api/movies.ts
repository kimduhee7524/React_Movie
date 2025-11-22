import { fetchTmdb } from '@/api/tmdbClient';
import {
  MovieResponse,
  GetMoviesParams,
  GetSearchMoviesParams,
  SearchMovieResponse,
  MovieDetailType,
} from '@/types/movie';

export const getPopularMovies = async (
  { page = 1, language = 'ko-KR' }: GetMoviesParams,
  options?: { next?: NextFetchRequestConfig; cache?: RequestCache }
): Promise<MovieResponse> => {
  return fetchTmdb<MovieResponse>(
    '/movie/popular',
    {
      page,
      language,
    },
    options
  );
};

export const getSearchMovies = async (
  { query, language = 'ko-KR', page = 1 }: GetSearchMoviesParams,
  options?: { next?: NextFetchRequestConfig; cache?: RequestCache }
): Promise<SearchMovieResponse> => {
  return fetchTmdb<SearchMovieResponse>(
    '/search/movie',
    {
      query,
      language,
      page,
    },
    options
  );
};

export const getMovieDetail = async (
  movieId: number,
  language = 'ko-KR',
  options?: { next?: NextFetchRequestConfig; cache?: RequestCache }
): Promise<MovieDetailType> => {
  return fetchTmdb<MovieDetailType>(
    `/movie/${movieId}`,
    {
      language,
    },
    options
  );
};
