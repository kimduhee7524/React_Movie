import axios from 'axios';

const TIMEOUT = 30000;
const TMDB_API_BASE = 'https://api.themoviedb.org/3';

const getBaseURL = (): string => {
  // 클라이언트 사이드: 상대 경로로 프록시 사용
  if (typeof window !== 'undefined') {
    return '/api/tmdb';
  }

  // 서버 사이드 - 런타임에서 프록시 사용 설정이 있으면 자체 API 라우트 사용
  if (
    process.env.NEXT_PUBLIC_USE_PROXY === 'true' &&
    process.env.NEXT_PUBLIC_SITE_URL
  ) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}/api/tmdb`;
  }

  // 빌드 타임 또는 프록시 미사용 시: TMDB 직접 호출
  return TMDB_API_BASE;
};

export const TMDB_BASE_URL = getBaseURL();

const getApiToken = (): string => {
  return process.env.TMDB_API_TOKEN || '';
};

// 헤더 설정: 직접 TMDB API 호출 시 Authorization 헤더 포함
const getHeaders = () => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  // TMDB 직접 호출 시 Authorization 헤더 추가
  if (TMDB_BASE_URL === TMDB_API_BASE) {
    const token = getApiToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

export const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: getHeaders(),
  timeout: TIMEOUT,
});

// TMDB API 호출을 위한 헬퍼 함수
export const callTmdbApi = async (
  endpoint: string,
  params?: Record<string, string>
) => {
  const isUsingProxy = TMDB_BASE_URL.includes('/api/tmdb');

  if (isUsingProxy) {
    // 프록시 사용 시
    const searchParams = new URLSearchParams({
      endpoint,
      ...params,
    });
    const response = await tmdbClient.get(`?${searchParams.toString()}`);
    return response.data;
  } else {
    // TMDB 직접 호출 시 (Authorization 헤더는 이미 설정됨)
    const searchParams = new URLSearchParams({
      language: 'ko-KR',
      ...params,
    });
    const response = await tmdbClient.get(
      `${endpoint}?${searchParams.toString()}`
    );
    return response.data;
  }
};
