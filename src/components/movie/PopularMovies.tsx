import { useState } from "react";
import { usePopularMovies } from "@/hooks/useMovies";
import Movie from "@/components/movie/Movie";
import SelectBox from "@/components/share/SelectBox";
import Pagination from "@/components/share/Pagination";
import { MovieType } from "@/types/movie";
import { languageOptions } from "@/constants/selectOptions";

const PopularMovies = () => {
  const [page, setPage] = useState(1);
  const [language, setLanguage] = useState("en-US");
  const { data } = usePopularMovies({ page, language });

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <SelectBox
          label="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          options={languageOptions}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data.results.map((movie: MovieType) => (
          <Movie key={movie.id} movie={movie} />
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <Pagination
          currentPage={page}
          totalPages={data.total_pages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
};

export default PopularMovies;
