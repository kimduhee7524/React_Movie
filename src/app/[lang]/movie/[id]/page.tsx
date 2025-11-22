import { Suspense } from 'react';
import BackButton from '@/components/share/BackButton';
import MovieDetailContent from '@/components/movie/detail/MovieDetailContent';
import MovieDetailSkeleton from '@/components/skeleton/MovieDetailSkeleton';
import { getMovieDetail } from '@/api/movies';
import { notFound } from 'next/navigation';

import { getLocaleFromLang } from '@/utils/language';

interface MovieDetailPageProps {
  params: Promise<{ id: string; lang: string }>;
}

export default async function MovieDetailPage({
  params,
}: MovieDetailPageProps) {
  const { id, lang } = await params;
  const movieId = parseInt(id || '0');
  const locale = getLocaleFromLang(lang);

  if (!movieId || movieId <= 0) {
    notFound();
  }

  const movieDetail = await getMovieDetail(movieId, locale, {
    next: { revalidate: 86400 }, // 24시간 캐시
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BackButton to="/" />

      <Suspense fallback={<MovieDetailSkeleton />}>
        <MovieDetailContent movieDetail={movieDetail} lang={lang} />
      </Suspense>
    </div>
  );
}
