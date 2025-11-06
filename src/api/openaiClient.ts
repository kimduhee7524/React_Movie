import axios from 'axios';

// 🔒 프록시 API를 사용하여 보안 강화 (API 키 서버에서만 사용)
export const OPENAI_BASE_URL = '/api/openai';
const TIMEOUT = 60000;

export const openaiClient = axios.create({
  baseURL: OPENAI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  const response = await openaiClient.post<OpenAIProxyResponse>('/', {
    prompt,
    options,
  });

  return response.data.content || '';
};

