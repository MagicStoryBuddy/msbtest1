// Test script for OpenAI API key
require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

const API_KEY = process.env.OPENAI_API_KEY || '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';

console.log('Testing OpenAI API key:', API_KEY.substring(0, 12) + '...');

// Test models endpoint
async function testModels() {
  try {
    console.log('Testing models endpoint...');
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Models endpoint successful. Available models:', data.data.length);
      return true;
    } else {
      console.error('Models endpoint failed with status:', response.status);
      const text = await response.text();
      console.error('Response body:', text);
      return false;
    }
  } catch (error) {
    console.error('Models endpoint test failed:', error);
    return false;
  }
}

// Test chat completions endpoint
async function testChatCompletions() {
  try {
    console.log('Testing chat completions...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "user", content: "Say hello!" }
        ],
        max_tokens: 10
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Chat completions successful. Response:', data.choices[0]?.message?.content);
      return true;
    } else {
      console.error('Chat completions failed with status:', response.status);
      const text = await response.text();
      console.error('Response body:', text);
      return false;
    }
  } catch (error) {
    console.error('Chat completions test failed:', error);
    return false;
  }
}

// Test DALL-E image generation
async function testDallE() {
  try {
    console.log('Testing DALL-E image generation...');
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: "A simple test image of a cute cartoon rabbit",
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      const imageUrl = data.data && data.data[0]?.url;
      console.log('DALL-E successful. Image URL:', imageUrl ? imageUrl.substring(0, 50) + '...' : 'No URL returned');
      return true;
    } else {
      console.error('DALL-E failed with status:', response.status);
      const text = await response.text();
      console.error('Response body:', text);
      return false;
    }
  } catch (error) {
    console.error('DALL-E test failed:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  const modelsResult = await testModels();
  const chatResult = await testChatCompletions();
  const dalleResult = await testDallE();
  
  console.log('\nTest Results:');
  console.log('Models API:', modelsResult ? 'PASSED' : 'FAILED');
  console.log('Chat Completions API:', chatResult ? 'PASSED' : 'FAILED');
  console.log('DALL-E Image API:', dalleResult ? 'PASSED' : 'FAILED');
}

runTests(); 