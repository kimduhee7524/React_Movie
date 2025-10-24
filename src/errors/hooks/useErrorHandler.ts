/**
 * 에러 핸들러 Hook
 * - Query/Mutation 에러를 Toast로 처리
 * - 일관된 로깅 + Sentry + Toast 처리
 */

import { useCallback } from 'react';
import { toast } from 'sonner';
import { BaseError } from '../types/BaseError';
import { handleError as coreHandleError } from '../errorHandlers';

/**
 * 에러 핸들러 Hook
 *
 * @example
 * ```typescript
 * // Mutation - 간단 사용
 * function LikeButton({ movieId }) {
 *   const { handleError } = useErrorHandler();
 *
 *   const mutation = useMutation({
 *     mutationFn: () => likeMovie(movieId),
 *     onError: handleError, // 🎯 바로 사용!
 *   });
 *
 *   return <button onClick={() => mutation.mutate()}>좋아요</button>;
 * }
 *
 * // Query - Toast 처리
 * function OptionalWidget() {
 *   const { handleError } = useErrorHandler();
 *
 *   const { data, error } = useQuery({
 *     queryKey: ['optional-data'],
 *     queryFn: fetchOptionalData,
 *     throwOnError: false, // Toast로 처리
 *   });
 *
 *   useEffect(() => {
 *     if (error) {
 *       handleError(error); // 바로 사용!
 *     }
 *   }, [error, handleError]);
 * }
 *
 * // 커스텀 메시지
 * function CustomAction() {
 *   const { handleErrorWithMessage } = useErrorHandler();
 *
 *   const mutation = useMutation({
 *     mutationFn: criticalAction,
 *     onError: (error) => handleErrorWithMessage(error, '중요한 작업이 실패했습니다'),
 *   });
 * }
 * ```
 */
export function useErrorHandler() {
  /**
   * 기본 에러 처리 (Toast)
   * - 로깅 + Sentry + Toast
   * - useMutation의 onError에 바로 사용 가능
   */
  const handleError = useCallback((error: unknown): void => {
    // 일관된 에러 처리 (로깅 + Sentry)
    const normalizedError = coreHandleError(error);

    // Toast 표시
    toast.error(normalizedError.getUserMessage());
  }, []);

  /**
   * 커스텀 메시지와 함께 에러 처리
   */
  const handleErrorWithMessage = useCallback(
    (error: unknown, customMessage: string): void => {
      // 일관된 에러 처리 (로깅 + Sentry)
      coreHandleError(error);

      // 커스텀 메시지로 Toast 표시
      toast.error(customMessage);
    },
    []
  );

  /**
   * 에러를 처리하고 정규화된 에러 반환 (고급 사용)
   */
  const handleErrorAndReturn = useCallback(
    (error: unknown, customMessage?: string): BaseError => {
      // 일관된 에러 처리 (로깅 + Sentry)
      const normalizedError = coreHandleError(error);

      // Toast 표시
      const message = customMessage || normalizedError.getUserMessage();
      toast.error(message);

      return normalizedError;
    },
    []
  );

  return {
    /** 기본 에러 처리 - useMutation의 onError에 바로 사용 */
    handleError,

    /** 커스텀 메시지와 함께 에러 처리 */
    handleErrorWithMessage,

    /** 고급: 에러 처리 후 BaseError 반환 (이전 handleToastError) */
    handleErrorAndReturn,

    // 하위 호환성을 위한 별칭
    handleToastError: handleErrorAndReturn,
  };
}
