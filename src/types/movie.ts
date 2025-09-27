import { Nullable } from './utils';

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

export interface MovieType extends BaseMovieType, PathType {}

export interface SearchedMovieType extends BaseMovieType, Nullable<PathType> {}

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

// 영화 상세 정보 타입
export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface BelongsToCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface MovieDetailType {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  original_language: string;
  original_title: string;
  popularity: number;
  adult: boolean;
  video: boolean;
  poster_path: string | null;
  backdrop_path: string | null;

  // 상세 정보 전용 필드들
  belongs_to_collection: BelongsToCollection | null;
  budget: number;
  genres: Genre[];
  homepage: string | null;
  imdb_id: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number | null;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string | null;
}

// AI 추천 관련 타입
export interface AIRecommendation {
  title: string;
  reason: string;
  genre: string;
  rating?: string;
}
