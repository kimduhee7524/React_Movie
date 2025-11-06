'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ControlledSearchInput() {
  const [keyword, setKeyword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 입력값 검증 함수
  // form을 다룰 떄 모든 인풋은 validation을 고려해야합니다.
  const validateInput = (input: string): string | null => {
    const trimmed = input.trim();

    // 빈 문자열 체크
    if (!trimmed) {
      return '검색어를 입력해주세요.';
    }

    // 최소 길이 체크 (2글자 이상) 예시
    if (trimmed.length < 2) {
      return '검색어는 2글자 이상 입력해주세요.';
    }

    // 최대 길이 체크 (100글자 이하) 예시
    if (trimmed.length > 100) {
      return '검색어는 100글자 이하로 입력해주세요.';
    }

    // 특수문자만으로 구성된 경우 체크
    if (!/[a-zA-Z0-9가-힣]/.test(trimmed)) {
      return '올바른 검색어를 입력해주세요.';
    }

    return null; // 유효한 입력
  };

  // validation에 따른 에러 처리도 같이 필요하겠죠?
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    // 에러 상태 초기화 (사용자가 다시 입력하기 시작할 때)
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Debug log
    console.log('🔍 Search submitted:', keyword);

    // 입력값 검증
    const validationError = validateInput(keyword);
    if (validationError) {
      setError(validationError);
      console.warn('❌ Validation failed:', validationError);
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const trimmedKeyword = keyword.trim();
      const encodedKeyword = encodeURIComponent(trimmedKeyword);

      // Debug log
      console.log(
        '✅ Navigating to search:',
        `/search?query=${encodedKeyword}`
      );

      router.push(`/search?query=${encodedKeyword}`);
      setKeyword(''); // 검색 성공 후 입력창 비우기
    } catch (navigationError) {
      // 네비게이션 에러 처리
      console.error('❌ Navigation error:', navigationError);
      setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };
  // 이렇게 하면 모든 인풋에 대한 검증을 할 수 있겠죠?

  return (
    <div className="relative w-full max-w-xs">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={keyword}
          onChange={handleInputChange}
          placeholder="Search movies..."
          disabled={isLoading}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring text-sm transition-colors ${
            error
              ? 'border-red-500 focus:ring-red-300'
              : 'border-gray-300 focus:ring-blue-300'
          } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? 'search-error' : undefined}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`absolute right-2 top-1/2 -translate-y-1/2 transition-colors ${
            isLoading
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-500 hover:text-black'
          }`}
          aria-label={isLoading ? '검색 중...' : '검색'}
        >
          {isLoading ? '⏳' : '🔍'}
        </button>
      </form>

      {/* 에러 메시지 표시 */}
      {error && (
        <div
          id="search-error"
          className="absolute top-full left-0 mt-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200 whitespace-nowrap z-10"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
