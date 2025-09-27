import { VirtuosoGrid } from 'react-virtuoso';
import Movie from '@/components/movie/list/Movie';
import MoviesSkeleton from '../skeleton/MoviesSkeleton';
import { usePopularMoviesInfinite } from '@/hooks/useMovies';
import { MovieType } from '@/types/movie';

interface Props {
  language?: string;
  region?: string;
}

const PopularMoviesScrollVirtual = ({ language = 'en-US' }: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePopularMoviesInfinite(language);

  const movies = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <VirtuosoGrid
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
            <div className="col-span-full">
              <MoviesSkeleton count={4} />
            </div>
          ) : null,
      }}
    />
  );
};

export default PopularMoviesScrollVirtual;
