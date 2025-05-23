export interface MovieType {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  popularity: number;
  adult: boolean;
  video: boolean;
}

export interface SearchedMovieType {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  popularity: number;
  adult: boolean;
  video: boolean;
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

export interface GetSearchMoviesParams {
  query: string;
  language?: string;
  page?: number;
}
