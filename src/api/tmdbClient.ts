const TMDB_API_BASE = 'https://api.themoviedb.org/3';

function getTmdbToken(): string {
  const token = process.env.TMDB_API_TOKEN;
  if (!token) {
    throw new Error('TMDB_API_TOKEN is not defined');
  }
  return token;
}

export async function fetchTmdb<T>(
  endpoint: string,
  params?: Record<string, string | number>,
  options?: {
    next?: NextFetchRequestConfig;
    cache?: RequestCache;
  }
): Promise<T> {
  const isClient = typeof window !== 'undefined';

  if (isClient) {
    // 클라이언트 사이드: API Route 사용
    const searchParams = new URLSearchParams({
      endpoint,
      ...params,
    });

    const response = await fetch(`/api/tmdb/?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } else {
    // 서버 사이드: TMDB 직접 호출
    const searchParams = new URLSearchParams({
      language: 'ko-KR',
      ...params,
    });

    const url = `${TMDB_API_BASE}${endpoint}?${searchParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getTmdbToken()}`,
        Accept: 'application/json',
      },
      next: options?.next || {
        revalidate: 60, // 기본 1분 캐시
      },
      cache: options?.cache,
    });

    if (!response.ok) {
      throw new Error(
        `TMDB API Error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }
}
