import PageLayout from '@/layouts/PageLayout';
import MoviesSkeleton from '@/components/skeleton/MoviesSkeleton';
import { Suspense } from 'react';
import SearchMovie from '@/components/movie/SearchMovie';
import { getSearchMovies } from '@/api/movies';

import { getLocaleFromLang } from '@/utils/language';

interface SearchPageProps {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ query?: string }>;
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { lang } = await params;
  const locale = getLocaleFromLang(lang);
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query?.trim() || '';

  const initialData = await getSearchMovies({
    query,
    page: 1,
    language: locale,
  });

  return (
    <PageLayout title={query ? `"${query}" 검색 결과` : '검색 결과'}>
      <Suspense
        fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
            <MoviesSkeleton count={12} />
          </div>
        }
      >
        <SearchMovie initialData={initialData} />
      </Suspense>
    </PageLayout>
  );
}
