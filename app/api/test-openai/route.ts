import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Initialize OpenAI with the provided API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    console.log('Testing OpenAI API connection...');
    console.log('API Key (first 5 chars):', process.env.OPENAI_API_KEY?.substring(0, 5));
    
    // Simple test request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "user", content: "Say hello!" }
      ],
      max_tokens: 10,
    });
    
    const content = response.choices[0]?.message?.content;
    
    return NextResponse.json({ 
      success: true, 
      message: 'OpenAI API connection successful!',
      response: content
    });
  } catch (error: any) {
    console.error('Error testing OpenAI connection:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to connect to OpenAI API' 
    }, { status: 500 });
  }
} 