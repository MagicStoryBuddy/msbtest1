import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import PDFDocument from 'pdfkit';
import fetch from 'node-fetch';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import os from 'os';

// API Key for OpenAI
const API_KEY = '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';

// Test OpenAI connection on startup
(async () => {
  try {
    console.log('Testing OpenAI connection for PDF generation...');
    const testConnectionStart = Date.now();
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json() as { data: any[] };
      const testConnectionDuration = Date.now() - testConnectionStart;
      console.log(`OpenAI connection for PDF generation successful in ${testConnectionDuration}ms. Models available:`, data.data.length);
      // List a few models to confirm we have proper access
      const models = data.data.slice(0, 5).map((model: any) => model.id);
      console.log('Available models include:', models.join(', '));
    } else {
      console.error('OpenAI connection test for PDF generation failed with status:', response.status);
      const text = await response.text();
      console.error('Response body:', text);
    }
  } catch (error) {
    console.error('OpenAI connection test for PDF generation failed:', error);
  }
})();

// Initialize OpenAI with the provided API key and better error logging
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || API_KEY,
  maxRetries: 3,
  timeout: 60000, // 60 seconds timeout
  defaultHeaders: {
    'User-Agent': 'Magic Story Buddy/1.0'
  },
  defaultQuery: {
    'api-version': '2023-05-15'
  },
  dangerouslyAllowBrowser: false
});

// Initialize AWS S3 client (if using S3 for storage)
// If not using S3, we'll use local storage temporarily
const s3Client = process.env.AWS_ACCESS_KEY_ID ? new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
}) : null;

// Function to split story into sections for illustrations
function splitStoryIntoSections(story: string, numSections = 5): string[] {
  // Remove any existing choice point markers
  let cleanStory = story.replace(/===CHOICE POINT===[\s\S]*?===END CHOICE POINT===/g, '');
  cleanStory = cleanStory.replace(/===OPTION A OUTCOME===[\s\S]*?===END OPTION A OUTCOME===/g, '');
  cleanStory = cleanStory.replace(/===OPTION B OUTCOME===[\s\S]*?===END OPTION B OUTCOME===/g, '');
  
  // Split the story into paragraphs
  const paragraphs = cleanStory.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  // If very few paragraphs, split by sentences
  if (paragraphs.length < numSections) {
    const sentences = cleanStory.match(/[^\.!\?]+[\.!\?]+/g) || [];
    
    // Group sentences into sections
    const sectionsLength = Math.max(Math.floor(sentences.length / numSections), 1);
    const sections: string[] = [];
    
    for (let i = 0; i < sentences.length; i += sectionsLength) {
      const sectionSentences = sentences.slice(i, i + sectionsLength);
      sections.push(sectionSentences.join(' '));
      
      if (sections.length >= numSections) break;
    }
    
    return sections;
  }
  
  // Group paragraphs into sections
  const sectionsLength = Math.max(Math.floor(paragraphs.length / numSections), 1);
  const sections: string[] = [];
  
  for (let i = 0; i < paragraphs.length; i += sectionsLength) {
    const sectionParagraphs = paragraphs.slice(i, i + sectionsLength);
    sections.push(sectionParagraphs.join('\n\n'));
    
    if (sections.length >= numSections) break;
  }
  
  return sections;
}

// Function to directly call DALL-E API using fetch
async function generateDallEImage(prompt: string): Promise<Buffer | null> {
  try {
    console.log('Starting DALL-E image generation with prompt:', prompt.substring(0, 100) + '...');
    
    // Make direct API call to OpenAI
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`DALL-E API error: ${response.status}`);
    }
    
    const data = await response.json();
    const imageUrl = data.data && data.data[0]?.url;
    
    if (!imageUrl) {
      console.error('No image URL returned from DALL-E');
      throw new Error('No image URL returned from DALL-E');
    }
    
    console.log('Successfully received image URL from DALL-E');
    
    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }
    
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    if (buffer.length === 0) {
      throw new Error('Downloaded image is empty');
    }
    
    console.log(`Successfully downloaded image (${buffer.length} bytes)`);
    return buffer;
  } catch (error) {
    console.error('DALL-E image generation failed:', error);
    return null;
  }
}

// Function to generate an image description for DALL-E based on a section of text
async function generateImageDescription(section: string, hero: string, place: string): Promise<string> {
  try {
    // Make prompt more directive for better results
    const prompt = `Create a detailed illustration prompt for a children's storybook featuring ${hero} in ${place}.
    
    Story section: "${section}"
    
    Create a vibrant, colorful, clear illustration description that captures the key moment from this scene.
    Focus on the main character and action.
    Make it child-friendly, cute, and visually engaging.
    Start with "A colorful storybook illustration of" and keep it under 100 words.`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a children's book illustrator who creates beautiful prompt descriptions for DALL-E." },
          { role: "user", content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error(`GPT-4 API error: ${response.status}`);
    }
    
    const data = await response.json();
    const description = data.choices?.[0]?.message?.content?.trim() || 
      `A colorful storybook illustration of ${hero} in ${place}, in a whimsical style appropriate for children.`;
      
    return description;
  } catch (error) {
    console.error('Error generating image description:', error);
    return `A colorful storybook illustration of ${hero} in ${place}, in a whimsical style appropriate for children.`;
  }
}

// Function to generate a title for the story
function formatStoryTitle(hero: string, place?: string, mission?: string): string {
  let storyTitle = `${hero}'s Adventure`;
  
  if (place && place.toLowerCase() !== 'magical world') {
    storyTitle += ` in the ${place}`;
  }
  
  if (mission && mission.toLowerCase() !== 'adventure') {
    if (mission.toLowerCase().startsWith('find') || 
        mission.toLowerCase().startsWith('help') ||
        mission.toLowerCase().startsWith('solve') ||
        mission.toLowerCase().startsWith('paint') ||
        mission.toLowerCase().startsWith('tame')) {
      storyTitle += `: ${mission}`;
    } else {
      storyTitle += `: ${mission}`;
    }
  }
  
  return storyTitle;
}

// Function to generate an image using DALL-E
async function generateImage(prompt: string): Promise<Buffer | null> {
  try {
    console.log('Generating image with prompt:', prompt.substring(0, 100) + '...');
    
    // Try DirectDallE mode first
    try {
      // Try to generate an image with DALL-E
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      });
      
      const imageUrl = response.data && response.data[0]?.url;
      
      if (!imageUrl) {
        console.error('No image URL returned from DALL-E');
        throw new Error('No image URL returned from DALL-E');
      }
      
      console.log('Successfully received image URL from DALL-E:', imageUrl.substring(0, 50) + '...');
      
      // Download the image
      console.log('Downloading image from URL...');
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`);
      }
      
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      if (buffer.length === 0) {
        throw new Error('Downloaded image is empty');
      }
      
      console.log(`Successfully downloaded image (${buffer.length} bytes)`);
      return buffer;
    } catch (dalleError) {
      // If DALL-E generation fails, fall back to a placeholder
      console.error('DALL-E image generation failed:', dalleError);
      throw dalleError;
    }
  } catch (error) {
    console.error('Error generating image with DALL-E:', error);
    
    // For testing purposes, we can return null here so the caller can handle it
    return null;
  }
}

// Function to provide a placeholder image when DALL-E fails
async function getPlaceholderImage(hero?: string, section?: number, total?: number): Promise<Buffer> {
  try {
    // Try to create a colorful gradient with text
    const width = 800;
    const height = 800;
    
    // Define color schemes for different sections
    const colorSchemes = [
      { bg1: "#9471DA", bg2: "#6FADCF", bg3: "#B39DDB", text: "#6A42B0" }, // Purple/blue
      { bg1: "#F48FB1", bg2: "#CE93D8", bg3: "#FF80AB", text: "#AD1457" }, // Pink
      { bg1: "#81C784", bg2: "#4DB6AC", bg3: "#A5D6A7", text: "#2E7D32" }, // Green
      { bg1: "#FFB74D", bg2: "#FFA726", bg3: "#FFCC80", text: "#E65100" }, // Orange
      { bg1: "#64B5F6", bg2: "#42A5F5", bg3: "#90CAF9", text: "#1565C0" }, // Blue
      { bg1: "#9575CD", bg2: "#7E57C2", bg3: "#B39DDB", text: "#4527A0" }  // Deep purple
    ];
    
    // Select a color scheme based on section number
    let colorScheme;
    if (section !== undefined && total !== undefined) {
      const index = section % colorSchemes.length;
      colorScheme = colorSchemes[index];
    } else {
      // Default to first scheme for cover or unspecified sections
      colorScheme = colorSchemes[0];
    }
    
    // Create a basic SVG with a gradient background and text
    const heroName = hero || 'Story';
    
    // Additional text based on section
    let sectionText = '';
    if (section !== undefined && total !== undefined) {
      if (section === 0) {
        sectionText = 'Cover Image';
      } else {
        sectionText = `Section ${section} of ${total}`;
      }
    }
    
    // Create the SVG with section-specific styling
    try {
      const svgImage = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colorScheme.bg1}" />
            <stop offset="50%" stop-color="${colorScheme.bg2}" />
            <stop offset="100%" stop-color="${colorScheme.bg3}" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#grad)" />
        <circle cx="${width/2}" cy="${height/2 - 100}" r="150" fill="#FFFFFF" opacity="0.8" />
        <text x="${width/2}" y="${height/2 - 100}" font-family="Arial" font-size="60" text-anchor="middle" fill="${colorScheme.text}" font-weight="bold">Magic Story</text>
        <text x="${width/2}" y="${height/2 - 20}" font-family="Arial" font-size="40" text-anchor="middle" fill="${colorScheme.text}">${heroName}</text>
        ${sectionText ? `<text x="${width/2}" y="${height/2 + 50}" font-family="Arial" font-size="30" text-anchor="middle" fill="${colorScheme.text}">${sectionText}</text>` : ''}
        <text x="${width/2}" y="${height/2 + 200}" font-family="Arial" font-size="24" text-anchor="middle" fill="#FFFFFF">Illustration will appear in the final version</text>
      </svg>
      `;
      
      return await sharp(Buffer.from(svgImage))
        .resize(width, height)
        .png()
        .toBuffer();
    } catch (svgError) {
      console.error('Error creating SVG placeholder:', svgError);
      
      // Fallback to a simple colored rectangle with text using a solid color
      return await sharp({
        create: {
          width,
          height,
          channels: 4,
          background: { r: 105, g: 132, b: 242, alpha: 1 }
        }
      })
      .png()
      .toBuffer();
    }
  } catch (error) {
    console.error('Error getting placeholder image:', error);
    
    // Create a simple colored square as last resort
    const size = 800;
    const canvas = new Uint8ClampedArray(size * size * 4);
    
    // Fill with light purple color
    for (let i = 0; i < canvas.length; i += 4) {
      canvas[i] = 149;     // R
      canvas[i + 1] = 125; // G
      canvas[i + 2] = 231; // B
      canvas[i + 3] = 255; // A
    }
    
    // Convert to buffer using sharp
    try {
      return await sharp(Buffer.from(canvas.buffer), {
        raw: {
          width: size,
          height: size,
          channels: 4
        }
      }).jpeg().toBuffer();
    } catch (sharpError) {
      // If sharp fails, return an empty buffer
      console.error('Error creating fallback image with sharp:', sharpError);
      return Buffer.from([]);
    }
  }
}

// Function to resize and optimize the image for PDF
async function optimizeImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // Resize and compress the image for the PDF
    return await sharp(imageBuffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .jpeg({ quality: 85 })
      .toBuffer();
  } catch (error) {
    console.error('Error optimizing image:', error);
    return imageBuffer;
  }
}

// Function to create PDF with the generated images and text
async function createPDF(storyTitle: string, story: string, sections: string[], images: Buffer[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create a PDF document
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 50,
        bufferPages: true,
        autoFirstPage: false // We'll create the pages manually for better control
      });
      
      // Collect PDF data chunks
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      
      // Add title page
      doc.addPage();
      
      doc.font('Helvetica-Bold')
         .fontSize(24)
         .text(storyTitle, { 
           align: 'center',
           continued: false
         })
         .moveDown(2);
      
      // Add the cover image if available
      if (images[0]) {
        try {
          doc.image(images[0], {
            fit: [500, 500],
            align: 'center',
            valign: 'center'
          });
        } catch (error) {
          console.error('Error adding cover image to PDF:', error);
        }
      }
      
      // Add a table of contents page
      doc.addPage();
      doc.font('Helvetica-Bold')
         .fontSize(18)
         .text('Table of Contents', { align: 'center' })
         .moveDown(1);
      
      // Add contents entries
      doc.font('Helvetica')
         .fontSize(12);
      
      doc.text('Cover Page', {
           align: 'left',
           link: '1',
           underline: true,
           continued: false
         })
         .moveDown(0.5);
      
      // Add each section to the TOC
      for (let i = 0; i < sections.length; i++) {
        doc.text(`Section ${i+1}`, {
             align: 'left',
             link: String(i+2),
             underline: true,
             continued: false
           })
           .moveDown(0.5);
      }
      
      // Add the full story entry to TOC
      doc.text('Complete Story', {
           align: 'left',
           link: String(sections.length+2),
           underline: true,
           continued: false
         })
         .moveDown(0.5);
      
      // Add section pages with illustrations
      for (let i = 0; i < sections.length; i++) {
        doc.addPage();
        
        doc.font('Helvetica-Bold')
           .fontSize(16)
           .text(`Section ${i+1}`, { align: 'center' })
           .moveDown(1);
        
        // Display section content
        doc.font('Helvetica')
           .fontSize(12)
           .text(sections[i], {
             align: 'left',
             paragraphGap: 10
           })
           .moveDown(2);
        
        // Add the corresponding image below the text
        if (i + 1 < images.length && images[i + 1]) {
          try {
            doc.image(images[i + 1], {
              fit: [500, 300],
              align: 'center',
              valign: 'center'
            });
          } catch (imageError) {
            console.error(`Error adding image ${i + 1} to PDF:`, imageError);
            doc.text("[ Image not available ]", { align: 'center' });
          }
        }
      }
      
      // Add the full story as an appendix
      doc.addPage();
      doc.font('Helvetica-Bold')
         .fontSize(18)
         .text('Complete Story', { align: 'center' })
         .moveDown(1);
      
      // Split story into paragraphs for better layout
      const paragraphs = story.split(/\n\n+/).filter(p => p.trim().length > 0);
      
      doc.font('Helvetica')
         .fontSize(12);
         
      // Add each paragraph with proper spacing
      paragraphs.forEach((paragraph, index) => {
        doc.text(paragraph, {
          align: 'left',
          continued: false
        });
        
        if (index < paragraphs.length - 1) {
          doc.moveDown(1);
        }
      });
      
      // Add page numbers
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc.font('Helvetica')
           .fontSize(8)
           .text(`Page ${i + 1} of ${pageCount}`, 
                 doc.page.margins.left, 
                 doc.page.height - 30,
                 { align: 'center' });
      }
      
      // Add a final note on the last page
      doc.switchToPage(pageCount - 1);
      doc.font('Helvetica-Oblique')
         .fontSize(9)
         .text("Created with Magic Story Buddy", 
              doc.page.margins.left,
              doc.page.height - 50,
              { align: 'center' });
      
      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Function to save PDF to S3 or local storage
async function savePDF(pdfBuffer: Buffer, filename: string): Promise<string> {
  if (s3Client) {
    // Save to S3
    const params = {
      Bucket: process.env.AWS_S3_BUCKET || 'magic-story-buddy',
      Key: `pdfs/${filename}`,
      Body: pdfBuffer,
      ContentType: 'application/pdf'
    };
    
    await s3Client.send(new PutObjectCommand(params));
    
    // Generate a signed URL for temporary access
    const getObjectParams = {
      Bucket: process.env.AWS_S3_BUCKET || 'magic-story-buddy',
      Key: `pdfs/${filename}`
    };
    
    return await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), { expiresIn: 3600 });
  } else {
    // If no S3 credentials, save to temp directory
    const tempDir = path.join(os.tmpdir(), 'magic-story-buddy');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const filePath = path.join(tempDir, filename);
    fs.writeFileSync(filePath, pdfBuffer);
    
    // For local dev, this would need a proper URL, but for now return the path
    return `/api/download-pdf?filename=${encodeURIComponent(filename)}`;
  }
}

// Update the POST handler to properly generate DALL-E images or fall back to placeholders
export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is available
    if (!API_KEY) {
      console.error('OpenAI API key is not available');
      return NextResponse.json({ 
        error: 'OpenAI API key is not configured',
        suggestion: 'Please set the OPENAI_API_KEY environment variable'
      }, { status: 500 });
    }

    const data = await request.json();
    const { story, hero, place, mission, lifeSkill, additionalHeroes } = data;
    
    if (!story) {
      return NextResponse.json({ error: 'Story content is required' }, { status: 400 });
    }
    
    // Generate a title for the story
    const storyTitle = formatStoryTitle(hero, place, mission);
    
    console.log(`Generating PDF for "${storyTitle}"`);
    
    // Split the story into sections for illustrations
    const sections = splitStoryIntoSections(story, 5);
    console.log(`Split story into ${sections.length} sections for illustrations`);
    
    // Initialize with placeholder images (known issue: DALL-E is not available with current API key)
    console.log('Using placeholder images for PDF generation');
    const images: Buffer[] = [];
    
    // Generate cover image placeholder
    console.log('Generating cover image placeholder');
    const coverImage = await getPlaceholderImage(`${hero}'s Adventure`, 0, sections.length);
    images.push(coverImage);
    
    // Generate section image placeholders
    for (let i = 0; i < sections.length; i++) {
      console.log(`Generating section ${i+1} image placeholder`);
      const sectionImage = await getPlaceholderImage(hero, i+1, sections.length);
      images.push(sectionImage);
    }
    
    // Create PDF with sections and images
    console.log('Creating PDF document...');
    const pdfBuffer = await createPDF(storyTitle, story, sections, images);
    
    // Save PDF and get URL
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeTitle = storyTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const filename = `${safeTitle}-${timestamp}.pdf`;
    
    console.log('Saving PDF file:', filename);
    const pdfUrl = await savePDF(pdfBuffer, filename);
    
    return NextResponse.json({ pdfUrl });
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    
    // If there's an authentication error, it might be an issue with the API key
    if (error.message && (
      error.message.includes('authentication') || 
      error.message.includes('API key') ||
      error.message.includes('401') ||
      error.message.includes('auth')
    )) {
      return NextResponse.json({ 
        error: 'OpenAI API key authentication failed. The key might be invalid or expired.',
        suggestion: 'Please contact support to update the API key.'
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to generate PDF',
      suggestion: 'The PDF feature requires special API access. We\'re working on it!'
    }, { status: 500 });
  }
} 