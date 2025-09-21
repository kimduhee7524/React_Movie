import { MovieDetailType } from '@/types/movie';

interface MovieDetailOverviewProps {
  movie: MovieDetailType;
}

export default function MovieDetailOverview({
  movie,
}: MovieDetailOverviewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">줄거리</h2>
      <p className="text-muted-foreground leading-relaxed text-lg">
        {movie.overview || '줄거리 정보가 없습니다.'}
      </p>
    </div>
  );
}
