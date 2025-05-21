import { apiClient } from "@/services/apiClient";
import {
  MovieResponse,
  GetMoviesParams,
  GetSearchMoviesParams,
  SearchMovieResponse,
} from "@/types/movie";

export const getPopularMovies = async ({
  page = 1,
  language = "en-US",
}: GetMoviesParams): Promise<MovieResponse> => {
  const response = await apiClient.get("/movie/popular", {
    params: { page, language },
  });
  return response.data;
};

export const getSearchMovies = async ({
  query,
  language = "en-US",
  page = 1,
}: GetSearchMoviesParams): Promise<SearchMovieResponse> => {
  const response = await apiClient.get("/search/movie", {
    params: {
      query,
      language,
      page,
    },
  });
  return response.data;
};
