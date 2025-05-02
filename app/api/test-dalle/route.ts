import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Initialize OpenAI with the provided API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    console.log('Testing DALL-E API connection...');
    
    // Simple test request to DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A simple test image of a cute cartoon rabbit",
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });
    
    const imageUrl = response.data && response.data[0]?.url;
    
    if (!imageUrl) {
      throw new Error('No image URL returned');
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'DALL-E API connection successful!',
      imageUrl: imageUrl
    });
  } catch (error: any) {
    console.error('Error testing DALL-E connection:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to connect to DALL-E API' 
    }, { status: 500 });
  }
} 