/**
 * Toast 에러 처리가 포함된 useQuery 래퍼
 * - throwOnError: false + 자동 Toast 처리
 * - 일관된 로깅 + Sentry 보장
 */

import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { useErrorHandler } from './useErrorHandler';

/**
 * Toast 에러 처리가 포함된 useQuery
 *
 * @example
 * ```typescript
 * // 기존 방식 (복잡)
 * function OptionalWidget() {
 *   const { handleError } = useErrorHandler();
 *
 *   const { data, error } = useQuery({
 *     queryKey: ['optional-data'],
 *     queryFn: fetchOptionalData,
 *     throwOnError: false,
 *   });
 *
 *   useEffect(() => {
 *     if (error) handleError(error);
 *   }, [error, handleError]);
 *
 *   if (error) return <div>데이터를 불러올 수 없습니다</div>;
 *   return <div>{data}</div>;
 * }
 *
 * // 새로운 방식 (간단)
 * function OptionalWidget() {
 *   const { data, isError } = useHandledQuery({
 *     queryKey: ['optional-data'],
 *     queryFn: fetchOptionalData,
 *   });
 *
 *   if (isError) return <div>데이터를 불러올 수 없습니다</div>;
 *   return <div>{data}</div>;
 * }
 *
 * // 커스텀 메시지
 * function CustomWidget() {
 *   const { data, isError } = useHandledQuery({
 *     queryKey: ['custom-data'],
 *     queryFn: fetchCustomData,
 *   }, {
 *     errorMessage: '커스텀 데이터 로딩에 실패했습니다',
 *   });
 *
 *   return isError ? <div>에러 상태</div> : <div>{data}</div>;
 * }
 * ```
 */

type UseHandledQueryOptions = {
  /** 커스텀 에러 메시지 (Toast에 표시) */
  errorMessage?: string;

  /** 에러 발생 시 콜백 */
  onError?: (error: unknown) => void;
};

export function useHandledQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
>(
  options: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'throwOnError' | 'onError'
  >,
  handledOptions?: UseHandledQueryOptions
): UseQueryResult<TData, TError> {
  const { handleError, handleErrorWithMessage } = useErrorHandler();

  // useQuery with throwOnError: false
  const queryResult = useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    throwOnError: false, // Toast로 처리
  });

  // 에러 자동 처리
  useEffect(() => {
    if (queryResult.error) {
      // 커스텀 콜백 먼저 실행
      handledOptions?.onError?.(queryResult.error);

      // Toast 처리 (일관된 로깅 + Sentry)
      if (handledOptions?.errorMessage) {
        handleErrorWithMessage(queryResult.error, handledOptions.errorMessage);
      } else {
        handleError(queryResult.error);
      }
    }
  }, [queryResult.error, handleError, handleErrorWithMessage, handledOptions]);

  return queryResult;
}

/**
 * Suspense Query의 Toast 버전
 * - useSuspenseQuery + Toast 에러 처리
 * - throwOnError: false가 적용되지 않으므로 일반 useQuery 사용
 */
export function useHandledSuspenseQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
>(
  options: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'throwOnError' | 'onError'
  >,
  handledOptions?: UseHandledQueryOptions
): UseQueryResult<TData, TError> {
  // Suspense는 throwOnError가 의미없으므로 일반 useHandledQuery 사용
  return useHandledQuery(options, handledOptions);
}
