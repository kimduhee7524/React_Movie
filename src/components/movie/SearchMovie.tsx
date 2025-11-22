'use client';

import { VirtuosoGrid } from 'react-virtuoso';
import { useSearchParams } from 'next/navigation';
import { useSearchMoviesInfinite } from '@/hooks/useMovies';
import Movie from '@/components/movie/list/Movie';
import MoviesSkeleton from '@/components/skeleton/MoviesSkeleton';
import { SearchedMovieType, SearchMovieResponse } from '@/types/movie';

interface SearchMovieProps {
  initialData: SearchMovieResponse;
}

export default function SearchMovie({ initialData }: SearchMovieProps) {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query')?.trim() || '';

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchMoviesInfinite(
      { query, language: 'ko-KR' },
      {
        initialData: {
          pages: [initialData],
          pageParams: [1],
        },
      }
    );

  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  if (movies.length === 0 && !isFetchingNextPage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground text-lg">
          "{query}"에 대한 검색 결과가 없습니다.
        </p>
      </div>
    );
  }

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
