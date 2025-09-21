import fallbackPoster from '@/assets/tempMovie.png';
import { MovieType } from '@/types/movie';
import { useState } from 'react';

const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL;

export default function Movie({ movie }: { movie: MovieType }) {
  const initialSrc = movie.poster_path
    ? `${IMG_BASE_URL}${movie.poster_path}`
    : fallbackPoster;
  const [imgSrc, setImgSrc] = useState(initialSrc);

  return (
    <div className="group w-[200px] bg-card/80 backdrop-blur-sm rounded-3xl overflow-hidden m-3 hip-hover neon-border hover:glow-purple transition-all duration-500">
      <div className="relative overflow-hidden">
        <img
          src={imgSrc}
          alt={movie.title || 'Movie poster'}
          onError={() => setImgSrc(fallbackPoster)}
          className="w-[200px] h-[280px] object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 right-2 bg-accent/90 backdrop-blur-sm text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h4 className="text-base font-bold text-foreground mb-1 line-clamp-1 group-hover:text-accent transition-colors duration-300">
          {movie.title}
        </h4>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
            {movie.release_date}
          </span>
        </div>
      </div>
    </div>
  );
}
