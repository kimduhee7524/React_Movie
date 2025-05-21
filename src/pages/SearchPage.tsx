import { useSearchParams } from "react-router-dom";
import { useSearchMoviesInfinite } from "@/hooks/useMovies";
import Movie from "@/components/movie/Movie";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query")?.trim() || "";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchMoviesInfinite({ query });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-xl font-semibold">
          🔍 검색 결과: <span className="text-blue-600">{query}</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data?.pages.flatMap((page) =>
          page.results.map((movie) => <Movie key={movie.id} movie={movie} />)
        )}
      </div>

      {/* 더 보기 버튼 */}
      {hasNextPage && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
          </button>
        </div>
      )}

      {/* 끝났을 때 메시지 */}
      {!hasNextPage && data?.pages.length > 0 && (
        <p className="mt-6 text-center text-sm text-gray-500">
          마지막 결과입니다.
        </p>
      )}
    </div>
  );
}
