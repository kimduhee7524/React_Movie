'use client';

import { VirtuosoGrid } from 'react-virtuoso';
import { useSearchParams } from 'next/navigation';
import { useSearchMoviesInfinite } from '@/hooks/useMovies';
import { useLanguageStore } from '@/stores/useLanguageStore';
import Movie from '@/components/movie/list/Movie';
import MoviesSkeleton from '@/components/skeleton/MoviesSkeleton';
import { SearchedMovieType } from '@/types/movie';

export default function SearchMovie() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query')?.trim() || '';
  const { language } = useLanguageStore();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchMoviesInfinite({ query, language });

  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <VirtuosoGrid<SearchedMovieType>
      useWindowScroll
      data={movies}
      endReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      listClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4"
      itemContent={(index, movie: SearchedMovieType) => (
        <Movie key={movie.id} movie={movie} />
      )}
      components={{
        Footer: () =>
          isFetchingNextPage ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
              <MoviesSkeleton count={8} />
            </div>
          ) : null,
      }}
    />
  );
}
