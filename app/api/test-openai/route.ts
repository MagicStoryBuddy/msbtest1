import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

function getOpenAIKey(): string | null {
  return process.env.OPENAI_API_KEY ?? null;
}

function requireOpenAIKey(): string {
  const key = getOpenAIKey();
  if (!key) {
    throw new Error(
      'OPENAI_API_KEY is not set. Add it to .env.local (for dev) and Vercel → Project → Settings → Environment Variables (for prod).'
    );
  }
  return key;
}

export async function GET(_request: NextRequest) {
  try {
    const key = getOpenAIKey();
    if (!key) {
      return NextResponse.json(
        { success: false, message: 'OPENAI_API_KEY not configured.' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey: requireOpenAIKey() });

    console.log('Testing OpenAI API connection…');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Say hello!' }],
      max_tokens: 10,
    });

    const content = response?.choices?.[0]?.message?.content ?? '[no content]';

    return NextResponse.json({
      success: true,
      message: 'OpenAI API connection successful!',
      response: content,
    });
  } catch (error: any) {
    console.error('Error testing OpenAI connection:', error?.message || error);
    if (/(401|unauthorized|invalid api key|authentication)/i.test(String(error?.message))) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Authentication failed. Check that OPENAI_API_KEY is set and valid (standard keys required for chat).',
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to connect to OpenAI API' },
      { status: 500 }
    );
  }
}
