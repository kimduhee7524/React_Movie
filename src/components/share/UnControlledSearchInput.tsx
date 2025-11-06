'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UnControlledSearchInput() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // 현재 컴포넌트의 모습을 보았을 때 복잡하지 않은 굉장히 심플한 form 같아요 이런경우 비제어 컴포넌트를 활용해보면 좋을것 같네요
  // 이렇게 Ref를 활용하여 비제어 컴포넌트로 만든다면 랜더링 최적화엔 더 유리하겠죠?
  // OnChange마다 리랜더링이 일어나지 않을테니까요
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const router = useRouter();

  // 컴포넌트 언마운트 시 debounce 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // 입력값 검증 함수
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

  // debounced validation (실시간 에러 체크용)
  const debouncedValidation = useCallback((value: string) => {
    // 이전 debounce 타이머 클리어
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // 새로운 debounce 타이머 설정 (500ms 후 실행)
    debounceRef.current = setTimeout(() => {
      const validationError = validateInput(value);
      setError(validationError || '');

      // Debug log
      if (validationError) {
        console.warn('⚠️ Real-time validation warning:', validationError);
      }
    }, 500);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // 에러 상태 즉시 초기화 (사용자가 다시 입력하기 시작할 때)
      if (error) {
        setError('');
      }

      // debounced validation 실행 (빈 값이 아닐 때만)
      if (value.trim()) {
        debouncedValidation(value);
      }
    },
    [error, debouncedValidation]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // uncontrolled input에서 값 가져오기
    const keyword = inputRef.current?.value || '';

    // Debug log
    console.log('🔍 Search submitted:', keyword);

    // debounce 타이머 클리어 (즉시 validation 실행)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // 입력값 검증
    const validationError = validateInput(keyword);
    if (validationError) {
      setError(validationError);
      console.warn('❌ Validation failed:', validationError);
      // 포커스를 input으로 이동
      inputRef.current?.focus();
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

      // 검색 성공 후 입력창 비우기 (uncontrolled)
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (navigationError) {
      // 네비게이션 에러 처리
      console.error('❌ Navigation error:', navigationError);
      setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
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
