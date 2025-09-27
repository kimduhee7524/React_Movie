import axios, { AxiosResponse } from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    ...(OPENAI_API_KEY && { Authorization: `Bearer ${OPENAI_API_KEY}` }),
  },
  timeout: 30000, // 30초 타임아웃
});

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const callOpenAI = async (prompt: string): Promise<string> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API 키가 설정되지 않았습니다.');
  }

  try {
    const response: AxiosResponse<OpenAIResponse> = await openaiClient.post(
      '/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }
    );

    return response.data.choices[0]?.message?.content || '';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.error?.message || error.message;
      throw new Error(`OpenAI API 오류 (${status}): ${message}`);
    }

    console.error('OpenAI API 호출 실패:', error);
    throw error;
  }
};
