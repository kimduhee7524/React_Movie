import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchInput() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?query=${encodeURIComponent(keyword.trim())}`);
      setKeyword("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search movies..."
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 text-sm"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
        aria-label="Search"
      >
        🔍
      </button>
    </form>
  );
}
