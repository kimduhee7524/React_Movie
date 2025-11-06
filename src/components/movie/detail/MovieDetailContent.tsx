'use client';

import { useMovieDetail } from '@/hooks/useMovies';
import { useLanguageStore } from '@/stores/useLanguageStore';
import MovieDetailHeader from './MovieDetailHeader';
import MovieDetailPoster from './MovieDetailPoster';
import MovieDetailOverview from './MovieDetailOverview';
import MovieDetailCompanies from './MovieDetailCompanies';
import MovieDetailLinks from './MovieDetailLinks';
import MovieAIRecommendationsContent from './MovieAIRecommendationsContent';

const IMG_BASE_URL = process.env.NEXT_PUBLIC_IMG_BASE_URL;

interface MovieDetailContentProps {
  movieId: number;
}

export default function MovieDetailContent({
  movieId,
}: MovieDetailContentProps) {
  const { language } = useLanguageStore();
  const { data: movie } = useMovieDetail(movieId, language);

  return (
    <>
      {movie.backdrop_path && (
        <div className="absolute inset-0 z-0">
          <img
            src={`${IMG_BASE_URL}${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <MovieDetailPoster movie={movie} />

          <div className="lg:col-span-2 space-y-8">
            <MovieDetailHeader movie={movie} />
            <MovieDetailOverview movie={movie} />
            <MovieDetailCompanies movie={movie} />
            <MovieDetailLinks movie={movie} />
          </div>
        </div>

        <div className="mt-12">
          <MovieAIRecommendationsContent movie={movie} />
        </div>
      </div>
    </>
  );
}
