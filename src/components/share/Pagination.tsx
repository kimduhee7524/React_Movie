import { getPageNumbers } from "@/utils/table";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center mt-4 gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 rounded border hover:bg-gray-100 disabled:opacity-50"
      >
        &lt;
      </button>

      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`min-w-[2.5rem] h-10 rounded flex items-center justify-center 
          px-2 text-sm
          ${currentPage === page ? "bg-black text-white" : "border hover:bg-gray-100"} 
          ${page === "..." ? "cursor-default" : ""}`}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 rounded border hover:bg-gray-100 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
}
