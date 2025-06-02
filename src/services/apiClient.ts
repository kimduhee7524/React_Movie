import axios, { InternalAxiosRequestConfig, isAxiosError } from 'axios';

const ACCESS_TOKEN = import.meta.env.VITE_API_TOKEN;
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const apiClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

// 예시 코드 
// 아래와 같이 Interceptor를 활용해서 인증처리로직을 집어넣을 수 있음 
// 세션 타입 유틸리티 함수
// const hasAccessToken = (session: any): session is { accessToken: string } => {
//   return session && typeof session.accessToken === 'string';
// };


// // 요청 핸들러 설정
// const handleRequest = async (config: InternalAxiosRequestConfig) => {
//   try {
//     // 로그인/회원가입 엔드포인트는 인터셉터 스킵
//     if (config.url?.includes('/login') || config.url?.includes('/signup')) {
//       console.log('인증 불필요 요청 감지 - 인터셉터 스킵:', config.url);
//       return config;
//     }

//     const session = await getSession();

//     // 타입 가드를 사용하여 accessToken이 있는지 확인
//     if (!hasAccessToken(session)) {
//       console.log('세션에 액세스 토큰 없음, 인증 헤더 추가하지 않음');
//       return config;
//     }

     
//     config.headers.Authorization = `Bearer ${session.accessToken}`;
//     console.log('요청에 인증 토큰 추가됨');
//     return config;
//   } catch (error) {
//     console.error('Request interceptor error:', error);
//     return config;
//   }
// };

// const handleError = async (error: unknown) => {
//   if (isAxiosError(error) && error.response?.status === 401) {
//     console.log('401 오류 감지, 오류 응답만 반환 (리다이렉트 하지 않음)');
//     return Promise.reject(error);
//   }

//   return Promise.reject(error);
// };

// // 인터셉터 설정
// apiClient.interceptors.request.use(handleRequest, handleError);
// apiClient.interceptors.response.use((response) => {
//   console.log('API 응답:', response.status, response.data);
//   return response;
// }, handleError);
