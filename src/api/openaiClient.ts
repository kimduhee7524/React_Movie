import axios, { AxiosResponse } from 'axios';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const TIMEOUT = 60000;

export const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    ...(OPENAI_API_KEY && { Authorization: `Bearer ${OPENAI_API_KEY}` }),
  },
  timeout: TIMEOUT,
});

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const callOpenAI = async (prompt: string): Promise<string> => {
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

  return response.data?.choices?.[0]?.message?.content || '';
};
