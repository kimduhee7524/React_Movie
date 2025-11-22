'use client';

import { Suspense, use } from 'react';
import BackButton from '@/components/share/BackButton';
import MovieDetailContent from '@/components/movie/detail/MovieDetailContent';
import MovieDetailSkeleton from '@/components/skeleton/MovieDetailSkeleton';

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = use(params);
  const movieId = parseInt(id || '0');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BackButton to="/" />

      <Suspense fallback={<MovieDetailSkeleton />}>
        <MovieDetailContent movieId={movieId} />
      </Suspense>
    </div>
  );
}
