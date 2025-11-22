import axios from 'axios';

export const TMDB_BASE_URL = '/api/tmdb';
const TIMEOUT = 30000;

export const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  timeout: TIMEOUT,
});

// TMDB API 호출을 위한 헬퍼 함수
export const callTmdbApi = async (
  endpoint: string,
  params?: Record<string, string>
) => {
  const searchParams = new URLSearchParams({
    endpoint,
    ...params,
  });

  const response = await tmdbClient.get(`?${searchParams.toString()}`);
  return response.data;
};

