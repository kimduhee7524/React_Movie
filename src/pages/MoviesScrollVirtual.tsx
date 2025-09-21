import PageLayout from '@/layouts/PageLayout';
import ErrorFallback from '@/components/share/ErrorFallback';
import PopularMoviesScrollVirtual from '@/components/movie/PopularMoviesScrollVirtual';
import MoviesSkeleton from '@/components/skeleton/MoviesSkeleton';
import SelectBox from '@/components/share/SelectBox';
import { LANGUAGE_OPTIONS } from '@/constants/selectOptions';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function MoviesScrollVirtual() {
  const [language, setLanguage] = useState('en-US');

  return (
    <PageLayout title="인기 영화 (Infinite Scroll)">
      <div className="flex flex-wrap items-center gap-4">
        <SelectBox
          label="Language"
          value={language}
          onChange={setLanguage}
          options={LANGUAGE_OPTIONS}
        />
      </div>

      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorFallback
            error={error}
            resetErrorBoundary={resetErrorBoundary}
          />
        )}
      >
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              <MoviesSkeleton />
            </div>
          }
        >
          <PopularMoviesScrollVirtual language={language} />
        </Suspense>
      </ErrorBoundary>
    </PageLayout>
  );
}
