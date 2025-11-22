import { OpenAIOptions, OpenAIResponse, OpenAIProxyResponse } from '@/types/openai';

const OPENAI_API_BASE = 'https://api.openai.com/v1';

function getOpenAIApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined');
  }
  return apiKey;
}

export const callOpenAI = async (
  prompt: string,
  options?: OpenAIOptions
): Promise<string> => {
  const isClient = typeof window !== 'undefined';

  const defaultOptions = {
    model: 'gpt-4o-mini',
    max_tokens: 1000,
    temperature: 0.7,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  if (isClient) {
    // 클라이언트 사이드: API Route 사용
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        options: mergedOptions,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as OpenAIProxyResponse;
    return data.content || '';
  } else {
    // 서버 사이드: OpenAI 직접 호출
    const apiKey = getOpenAIApiKey();

    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        ...mergedOptions,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as OpenAIResponse;
    return data.choices?.[0]?.message?.content || '';
  }
};
