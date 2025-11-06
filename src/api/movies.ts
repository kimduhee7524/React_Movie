import { callTmdbApi } from '@/api/tmdbClient';
import {
  MovieResponse,
  GetMoviesParams,
  GetSearchMoviesParams,
  SearchMovieResponse,
  MovieDetailType,
} from '@/types/movie';

export const getPopularMovies = async ({
  page = 1,
  language = 'en-US',
}: GetMoviesParams): Promise<MovieResponse> => {
  return await callTmdbApi('/movie/popular', {
    page: page.toString(),
    language,
  });
};

export const getSearchMovies = async ({
  query,
  language = 'en-US',
  page = 1,
}: GetSearchMoviesParams): Promise<SearchMovieResponse> => {
  return await callTmdbApi('/search/movie', {
    query,
    language,
    page: page.toString(),
  });
};

export const getMovieDetail = async (
  movieId: number,
  language = 'en-US'
): Promise<MovieDetailType> => {
  return await callTmdbApi(`/movie/${movieId}`, {
    language,
  });
};
