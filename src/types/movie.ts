import { Nullable } from "./utils";

interface BaseMovieType {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  popularity: number;
  adult: boolean;
  video: boolean;
}
interface PathType {
  poster_path: string;
  backdrop_path: string;
}

export interface MovieType extends BaseMovieType, PathType { 
}

export interface SearchedMovieType extends BaseMovieType, Nullable<PathType> {
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type MovieResponse = PaginatedResponse<MovieType>;
export type SearchMovieResponse = PaginatedResponse<SearchedMovieType>;

export interface GetMoviesParams {
  page?: number;
  language?: string;
}

export interface GetSearchMoviesParams extends GetMoviesParams {
  query: string;
}
