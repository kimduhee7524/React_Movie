'use client';

import { VirtuosoGrid } from 'react-virtuoso';
import Movie from '@/components/movie/list/Movie';
import MoviesSkeleton from '../../skeleton/MoviesSkeleton';
import { MovieType, MovieResponse } from '@/types/movie';
import { useSuspensePopularMoviesInfinite } from '@/hooks/useMovies';

interface PopularMoviesScrollVirtualProps {
  initialData: MovieResponse;
  language: string;
}

const PopularMoviesScrollVirtual = ({
  initialData,
  language,
}: PopularMoviesScrollVirtualProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspensePopularMoviesInfinite(
      { language },
      {
        initialData: {
          pages: [initialData],
          pageParams: [1],
        },
      }
    );

  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <VirtuosoGrid<MovieType>
      useWindowScroll
      data={movies}
      endReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      listClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4"
      itemContent={(index, movie: MovieType) => (
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
};

export default PopularMoviesScrollVirtual;
