import { Star, Calendar, Clock, Globe } from 'lucide-react';
import { MovieDetailType } from '@/types/movie';
import { formatRuntime } from '@/utils/formatters';

interface AIReviewMovieCardProps {
  movie: MovieDetailType;
}

export default function AIReviewMovieCard({ movie }: AIReviewMovieCardProps) {
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
      <div className="space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
          {movie.title}
        </h2>

        {movie.original_title !== movie.title && (
          <p className="text-lg text-muted-foreground italic">
            {movie.original_title}
          </p>
        )}

        {movie.tagline && (
          <p className="text-lg text-accent italic">"{movie.tagline}"</p>
        )}

        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-full">
            <Star className="fill-accent text-accent" size={16} />
            <span className="font-semibold">
              {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-muted-foreground">
              ({movie.vote_count.toLocaleString()})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-accent" />
            <span>{movie.release_date}</span>
          </div>

          {movie.runtime && (
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-accent" />
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Globe size={16} className="text-accent" />
            <span className="uppercase">{movie.original_language}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">상태:</span>
            <span className="font-medium">{movie.status}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {movie.genres.map((genre) => (
            <span
              key={genre.id}
              className="px-3 py-1 bg-secondary/50 text-secondary-foreground rounded-full text-sm font-medium"
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
