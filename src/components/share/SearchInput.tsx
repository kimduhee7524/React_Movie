import { useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateSearchKeyword } from '@/utils/validate';
import { useDebouncedValidator } from '@/hooks/useDebouncedValidator';

export default function SearchInput() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const { validate: debouncedValidate, cancel } = useDebouncedValidator(
    validateSearchKeyword,
    500,
    setError
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (error) setError('');
      if (value.trim()) debouncedValidate(value);
    },
    [debouncedValidate, error]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const keyword = inputRef.current?.value || '';
    cancel();

    const error = validateSearchKeyword(keyword);
    if (error) {
      setError(error);
      inputRef.current?.focus();
      return;
    }

    try {
      setError('');
      const encodedKeyword = encodeURIComponent(keyword.trim());
      navigate(`/search?query=${encodedKeyword}`);
      if (inputRef.current) inputRef.current.value = '';
    } catch (error) {
      setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search movies..."
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring transition-colors ${
          error
            ? 'border-red-500 focus:ring-red-300'
            : 'border-gray-300 focus:ring-blue-300'
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? 'search-error' : undefined}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
        aria-label="검색"
      >
        🔍
      </button>
      {error && (
        <div
          id="search-error"
          className="absolute top-full left-0 mt-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200 whitespace-nowrap z-10"
          role="alert"
        >
          {error}
        </div>
      )}
    </form>
  );
}
