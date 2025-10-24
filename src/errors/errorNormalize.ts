import { AxiosError, isAxiosError } from 'axios';
import { BaseError } from './types/BaseError';
import {
  ApiError,
  type TMDBErrorCode,
  type OpenAIErrorCode,
} from './classes/ApiError';
import { NetworkError } from './classes/NetworkError';
import { UnknownError } from './classes/UnknownError';
import { ErrorCodes } from './types/errorCodes';

import {
  isTMDBError,
  mapTMDBToApiErrorCode,
  type TMDBErrorResponse,
} from './external/tmdb';
import {
  isOpenAIError,
  detectOpenAIErrorType,
  mapOpenAIToApiErrorCode,
  type OpenAIErrorResponse,
} from './external/openai';

/**
 * 원시 에러를 커스텀 에러로 변환하는 중앙 처리 함수
 * - 리포팅은 하지 않음 (순수 변환만)
 * - handleError() 내부에서 사용되거나 직접 변환만 필요할 때 사용
 */
export const normalizeError = (error: unknown): BaseError => {
  // 이미 커스텀 에러인 경우 그대로 반환
  if (error instanceof BaseError) {
    return error;
  }

  // 전역 네트워크 상태 체크
  if (!navigator.onLine) {
    return NetworkError.offline();
  }

  // Axios 에러 처리
  if (isAxiosError(error)) {
    return normalizeAxiosError(error);
  }

  // 일반 Error 객체 처리
  if (error instanceof Error) {
    return normalizeGeneralError(error);
  }

  // 기타 (문자열, 객체 등)
  const message = typeof error === 'string' ? error : 'Unknown error occurred';
  return UnknownError.general(message);
};

// Axios 에러 전용 처리 함수
function normalizeAxiosError(axiosError: AxiosError): BaseError {
  const responseData = axiosError.response?.data;
  const statusCode = axiosError.response?.status;
  const endpoint = axiosError.config?.url || 'unknown';

  // 타임아웃 체크
  if (axiosError.code === 'ECONNABORTED') {
    return NetworkError.timeout(endpoint, axiosError.config?.timeout || 30000);
  }

  // 외부 API 에러 감지
  const baseURL = axiosError.config?.baseURL || '';
  const fullURL = baseURL + endpoint;

  const isTMDBEndpoint =
    fullURL.includes('themoviedb.org') ||
    baseURL.includes('themoviedb.org') ||
    endpoint.includes('tmdb');

  const isOpenAIEndpoint =
    fullURL.includes('openai.com') ||
    baseURL.includes('openai.com') ||
    endpoint.includes('api.openai');

  // TMDB API 에러
  if (isTMDBEndpoint && isTMDBError(responseData)) {
    const tmdbResponse = responseData as TMDBErrorResponse;
    const mappedCode = mapTMDBToApiErrorCode(tmdbResponse.status_code);

    return ApiError.tmdb(tmdbResponse.status_message || 'TMDB API Error', {
      code: mappedCode as TMDBErrorCode,
      originalError: axiosError,
      statusCode,
      endpoint,
      serviceErrorCode: tmdbResponse.status_code,
      serviceErrorMessage: tmdbResponse.status_message,
    });
  }

  // OpenAI API 에러
  if (isOpenAIEndpoint && isOpenAIError(responseData)) {
    const openaiResponse = responseData as OpenAIErrorResponse;
    const errorType = detectOpenAIErrorType(
      statusCode || 500,
      openaiResponse.error.message
    );
    const mappedCode = mapOpenAIToApiErrorCode(errorType);

    return ApiError.openai(openaiResponse.error.message || 'OpenAI API Error', {
      code: mappedCode as OpenAIErrorCode,
      originalError: axiosError,
      statusCode,
      endpoint,
      serviceErrorCode: openaiResponse.error.code || errorType,
      serviceErrorMessage: openaiResponse.error.message,
    });
  }

  // 일반 Axios 에러
  return ApiError.fromAxiosError(axiosError);
}

// 일반 Error 객체 전용 처리 함수
function normalizeGeneralError(error: Error): BaseError {
  const message = error.message.toLowerCase();

  // 네트워크 관련 키워드 체크
  if (message.includes('network') || message.includes('fetch')) {
    return new NetworkError(error.message, { originalError: error });
  }

  // 타임아웃 관련 키워드 체크
  if (message.includes('timeout')) {
    return new NetworkError(error.message, {
      code: ErrorCodes.NETWORK_TIMEOUT,
      originalError: error,
    });
  }

  // 분류할 수 없는 일반 에러
  return UnknownError.general(error.message, error);
}
