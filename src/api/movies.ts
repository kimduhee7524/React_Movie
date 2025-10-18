import { tmdbClient } from '@/api/tmdbClient';
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
  const response = await tmdbClient.get('/movie/popular', {
    params: { page, language },
  });

  return response.data;
};

export const getSearchMovies = async ({
  query,
  language = 'en-US',
  page = 1,
}: GetSearchMoviesParams): Promise<SearchMovieResponse> => {
  const response = await tmdbClient.get('/search/movie', {
    params: {
      query,
      language,
      page,
    },
  });

  return response.data;
};

export const getMovieDetail = async (
  movieId: number,
  language = 'en-US'
): Promise<MovieDetailType> => {
  const response = await tmdbClient.get(`/movie/${movieId}`, {
    params: { language },
  });

  return response.data;
};
