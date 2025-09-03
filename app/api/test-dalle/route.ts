import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

function getOpenAIKey(): string | null {
  return process.env.OPENAI_API_KEY ?? null;
}

function requireOpenAIKey(): string {
  const k = getOpenAIKey();
  if (!k) {
    throw new Error('OPENAI_API_KEY is not set. Add it to .env.local (dev) and Vercel → Project → Settings → Environment Variables (prod).');
  }
  return k;
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

    // Heads-up for project-scoped keys (often no image access)
    if (key.startsWith('sk-proj-')) {
      return NextResponse.json({
        success: false,
        message: 'Project-scoped key detected. DALL·E access is typically unavailable for project keys. Use a standard API key or skip this test.',
      });
    }

    // Create client lazily with the env key
    const openai = new OpenAI({ apiKey: requireOpenAIKey() });

    // Minimal image generation sanity check
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: 'A simple test image of a cute cartoon rabbit',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    const imageUrl = response?.data?.[0]?.url;
    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: 'No image URL returned from DALL·E.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'DALL·E API connection successful!',
      imageUrl,
    });
  } catch (error: any) {
    console.error('Error testing DALL·E connection:', error?.message || error);
    // Helpful auth hint
    if (/(unauthorized|401|invalid api key|authentication)/i.test(String(error?.message))) {
      return NextResponse.json(
        { success: false, message: 'Authentication failed. Check OPENAI_API_KEY (standard key required for images).' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to connect to DALL·E API' },
      { status: 500 }
    );
  }
}
