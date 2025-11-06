import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
}

const openaiServerClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    ...(OPENAI_API_KEY && { Authorization: `Bearer ${OPENAI_API_KEY}` }),
  },
  timeout: 60000,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, options = {} } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'prompt가 필요합니다.' },
        { status: 400 }
      );
    }

    const defaultOptions = {
      model: 'gpt-4o-mini',
      max_tokens: 1000,
      temperature: 0.7,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    const response = await openaiServerClient.post('/chat/completions', {
      ...mergedOptions,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.data?.choices?.[0]?.message?.content || '';

    return NextResponse.json({
      content,
      usage: response.data.usage,
    });
  } catch (error) {
    console.error('OpenAI API 프록시 오류:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: 'OpenAI API 요청 실패',
          details: error.response?.data || error.message,
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json({ error: '내부 서버 오류' }, { status: 500 });
  }
}
