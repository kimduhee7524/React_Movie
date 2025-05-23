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
    <div className="w-[200px] bg-white rounded-2xl shadow-lg overflow-hidden m-3 transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <img
        src={imgSrc}
        alt={movie.title || 'Movie poster'}
        onError={() => setImgSrc(fallbackPoster)}
        className="w-[200px] h-[280px] object-cover"
      />

      <div className="p-3 ">
        <h4 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
          {movie.title}
        </h4>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span>⭐ {movie.vote_average.toFixed(1)}</span>
          <span className="text-xs">·</span>
          <span>{movie.release_date}</span>
        </div>
      </div>
    </div>
  );
}
