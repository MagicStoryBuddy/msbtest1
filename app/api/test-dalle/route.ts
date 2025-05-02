import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// API Key for OpenAI
const API_KEY = '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';

// Initialize OpenAI with the provided API key (with fallback)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    console.log('Testing DALL-E API connection...');
    console.log('Using API key (first 12 chars):', (process.env.OPENAI_API_KEY || API_KEY).substring(0, 12) + '...');
    
    // For project API keys that don't have DALL-E access, return a mock success
    if ((process.env.OPENAI_API_KEY || API_KEY).startsWith('sk-proj-')) {
      console.log('Detected project API key, which typically does not have DALL-E access');
      return NextResponse.json({ 
        success: false, 
        message: 'Using project API key which does not have DALL-E access.',
        mockImageUrl: 'https://placeholder.com/1024x1024'
      });
    }
    
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