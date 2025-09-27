import { Globe } from 'lucide-react';
import { MovieDetailType } from '@/types/movie';

interface MovieDetailLinksProps {
  movie: MovieDetailType;
}

export default function MovieDetailLinks({ movie }: MovieDetailLinksProps) {
  if (!movie.homepage) return null;

  return (
    <div className="pt-6">
      <a
        href={movie.homepage}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hip-hover neon-border"
      >
        <Globe size={16} />
        공식 홈페이지
      </a>
    </div>
  );
}
