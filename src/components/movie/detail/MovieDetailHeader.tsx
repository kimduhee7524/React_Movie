import { Star, Calendar, Clock, Globe, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { MovieDetailType } from '@/types/movie';
import { formatRuntime } from '@/utils/formatters';

interface MovieDetailHeaderProps {
  movie: MovieDetailType;
  lang: string;
}

export default function MovieDetailHeader({ movie, lang }: MovieDetailHeaderProps) {

  return (
    <div className="space-y-4">
      <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
        {movie.title}
      </h1>

      {movie.tagline && (
        <p className="text-xl text-accent italic">"{movie.tagline}"</p>
      )}

      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-2 bg-accent/10 px-3 py-2 rounded-full">
          <Star className="fill-accent text-accent" size={16} />
          <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
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

      <div className="pt-4">
        <Link
          href={`/${lang}/movie/${movie.id}/ai-review`}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Sparkles className="h-5 w-5" />
          AI 리뷰 보기
        </Link>
      </div>
    </div>
  );
}
