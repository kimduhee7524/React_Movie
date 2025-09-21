import { MovieDetailType } from '@/types/movie';

const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL;

interface MovieDetailPosterProps {
  movie: MovieDetailType;
}

export default function MovieDetailPoster({ movie }: MovieDetailPosterProps) {
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-6">
        <div className="aspect-[2/3] rounded-3xl overflow-hidden neon-border glow-purple shadow-2xl">
          <img
            src={
              movie.poster_path
                ? `${IMG_BASE_URL}${movie.poster_path}`
                : '/placeholder-poster.png'
            }
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
