import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { validateSearchKeyword } from '@/utils/validate';

export default function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const keyword = inputRef.current?.value ?? '';
    const error = validateSearchKeyword(keyword);

    if (error) {
      toast.error(error);
      return;
    }

    const trimmedKeyword = keyword.trim();
    navigate(`/search?query=${encodeURIComponent(trimmedKeyword)}`);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
      <input
        type="text"
        ref={inputRef}
        placeholder="Search movies..."
        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring focus:ring-blue-300"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
        aria-label="검색"
      >
        🔍
      </button>
    </form>
  );
}
