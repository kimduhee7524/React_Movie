import { VirtuosoGrid } from 'react-virtuoso';
import { useSearchParams } from 'react-router-dom';
import { useSearchMoviesInfinite } from '@/hooks/useMovies';
import { useLanguageStore } from '@/stores/useLanguageStore';
import Movie from '@/components/movie/list/Movie';
import MoviesSkeleton from '@/components/skeleton/MoviesSkeleton';
import { MovieType } from '@/types/movie';

export default function SearchMovie() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query')?.trim() || '';
  const { language } = useLanguageStore();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchMoviesInfinite({ query, language });

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
}
