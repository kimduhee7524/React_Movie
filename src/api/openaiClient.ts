import axios from 'axios';

const TIMEOUT = 60000;
const OPENAI_API_BASE = 'https://api.openai.com/v1';

const getOpenAIBaseURL = (): string => {
  // 클라이언트 사이드: 상대 경로로 프록시 사용
  if (typeof window !== 'undefined') {
    return '/api/openai';
  }

  // 서버 사이드 - 런타임에서 프록시 사용 설정이 있으면 자체 API 라우트 사용
  if (
    process.env.NEXT_PUBLIC_USE_PROXY === 'true' &&
    process.env.NEXT_PUBLIC_SITE_URL
  ) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}/api/openai`;
  }

  // 빌드 타임 또는 프록시 미사용 시: OpenAI 직접 호출
  return OPENAI_API_BASE;
};

export const OPENAI_BASE_URL = getOpenAIBaseURL();

const getApiKey = (): string => {
  return process.env.OPENAI_API_KEY || '';
};

// 헤더 설정: 직접 OpenAI API 호출 시 Authorization 헤더 포함
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // OpenAI 직접 호출 시 Authorization 헤더 추가
  if (OPENAI_BASE_URL === OPENAI_API_BASE) {
    const apiKey = getApiKey();
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }
  }

  return headers;
};

export const openaiClient = axios.create({
  baseURL: OPENAI_BASE_URL,
  headers: getHeaders(),
  timeout: TIMEOUT,
});

interface OpenAIProxyResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface OpenAIOptions {
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export const callOpenAI = async (
  prompt: string,
  options?: OpenAIOptions
): Promise<string> => {
  const isUsingProxy = OPENAI_BASE_URL.includes('/api/openai');

  if (isUsingProxy) {
    // 프록시 사용 시
    const response = await openaiClient.post<OpenAIProxyResponse>('/', {
      prompt,
      options,
    });
    return response.data.content || '';
  } else {
    // OpenAI 직접 호출 시 (Authorization 헤더는 이미 설정됨)
    const defaultOptions = {
      model: 'gpt-4o-mini',
      max_tokens: 1000,
      temperature: 0.7,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    const response = await openaiClient.post('/chat/completions', {
      ...mergedOptions,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.data?.choices?.[0]?.message?.content || '';
  }
};
