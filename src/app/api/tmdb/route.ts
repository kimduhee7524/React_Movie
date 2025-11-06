import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!API_TOKEN) {
  console.error('API_TOKEN 환경 변수가 설정되지 않았습니다.');
}

const tmdbServerClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${API_TOKEN}`,
  },
  timeout: 30000,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json(
        { error: 'endpoint 매개변수가 필요합니다.' },
        { status: 400 }
      );
    }

    // 보안을 위해 허용된 endpoint 패턴만 허용
    const allowedPatterns = [
      /^\/movie\/popular$/,
      /^\/movie\/\d+$/,
      /^\/movie\/\d+\/recommendations$/,
      /^\/search\/movie$/,
      /^\/genre\/movie\/list$/,
    ];

    const isAllowed = allowedPatterns.some((pattern) => pattern.test(endpoint));
    if (!isAllowed) {
      return NextResponse.json(
        { error: '허용되지 않은 endpoint입니다.' },
        { status: 403 }
      );
    }

    // 검색 매개변수들을 TMDB API에 전달
    const queryParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        queryParams.append(key, value);
      }
    });

    const response = await tmdbServerClient.get(
      `${endpoint}?${queryParams.toString()}`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('TMDB API 프록시 오류:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: 'TMDB API 요청 실패',
          details: error.response?.data || error.message,
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json({ error: '내부 서버 오류' }, { status: 500 });
  }
}
