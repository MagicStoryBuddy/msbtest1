import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if OpenAI API key is set
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
    const openAIKeyPrefix = hasOpenAIKey && process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 12) + '...' : 'Not set';
    
    return NextResponse.json({
      environment: process.env.NODE_ENV || 'not set',
      hasOpenAIKey,
      openAIKeyPrefix,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 