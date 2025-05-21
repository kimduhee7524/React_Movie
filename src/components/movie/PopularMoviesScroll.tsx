import Movie from "@/components/movie/Movie";
import { usePopularMoviesInfinite } from "@/hooks/useMovies";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import MoviesSkeleton from "../skeleton/MoviesSkeleton";
import { MovieType } from "@/types/movie";

interface Props {
  language?: string;
  region?: string;
}

const PopularMoviesScroll = ({ language = "en-US" }: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePopularMoviesInfinite(language);

  const { ref: sentinelRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data?.pages.flatMap((page) =>
          page.results.map((movie: MovieType) => (
            <Movie key={movie.id} movie={movie} />
          ))
        )}
        {isFetchingNextPage && <MoviesSkeleton count={4} />}
      </div>

      <div ref={sentinelRef} className="h-10" />
    </>
  );
};

export default PopularMoviesScroll;
