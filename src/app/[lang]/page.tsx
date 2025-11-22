import PageLayout from '@/layouts/PageLayout';
import PopularMoviesScrollVirtual from '@/components/movie/list/PopularMoviesScrollVirtual';
import MoviesSkeleton from '@/components/skeleton/MoviesSkeleton';
import { Suspense } from 'react';
import { getPopularMovies } from '@/api/movies';
import { getLocaleFromLang } from '@/utils/language';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = getLocaleFromLang(lang);

  const initialData = await getPopularMovies(
    {
      page: 1,
      language: locale,
    },
    { next: { revalidate: 3600 } } // 1시간 캐시
  );

  return (
    <PageLayout title="인기 영화">
      <Suspense
        fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
            <MoviesSkeleton count={12} />
          </div>
        }
      >
        <PopularMoviesScrollVirtual
          initialData={initialData}
          language={locale}
        />
      </Suspense>
    </PageLayout>
  );
}
