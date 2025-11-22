import { MovieDetailType } from '@/types/movie';
import MovieDetailHeader from './MovieDetailHeader';
import MovieDetailPoster from './MovieDetailPoster';
import MovieDetailOverview from './MovieDetailOverview';
import MovieDetailCompanies from './MovieDetailCompanies';
import MovieDetailLinks from './MovieDetailLinks';
import MovieAIRecommendationsContent from './MovieAIRecommendationsContent';
import { Suspense } from 'react';
import AIRecommendationsLoadingSkeleton from '@/components/skeleton/AIRecommendationsLoadingSkeleton';

const IMG_BASE_URL = process.env.NEXT_PUBLIC_IMG_BASE_URL;

interface MovieDetailContentProps {
  movieDetail: MovieDetailType;
  lang: string;
}

export default function MovieDetailContent({
  movieDetail: movie,
  lang,
}: MovieDetailContentProps) {
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
            <MovieDetailHeader movie={movie} lang={lang} />
            <MovieDetailOverview movie={movie} />
            <MovieDetailCompanies movie={movie} />
            <MovieDetailLinks movie={movie} />
          </div>
        </div>

        <div className="mt-12">
          <Suspense fallback={<AIRecommendationsLoadingSkeleton />}>
            <MovieAIRecommendationsContent movie={movie} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
