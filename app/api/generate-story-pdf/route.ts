import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import PDFDocument from 'pdfkit';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Toggle OpenAI usage (set to false to force built-in/placeholder flow)
const ENABLE_OPENAI = true;

// ---- OpenAI helpers ----
function getOpenAIKey(): string | null {
  return process.env.OPENAI_API_KEY ?? null;
}
function requireOpenAIKey(): string {
  const key = getOpenAIKey();
  if (!key) {
    throw new Error(
      'OPENAI_API_KEY is not set. Add it to .env.local (for dev) and Vercel Project Settings → Environment Variables (for prod).'
    );
  }
  return key;
}

// Lazy OpenAI client
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: requireOpenAIKey() });
  }
  return _openai;
}

// Dev-only connection test (never runs in production)
if (ENABLE_OPENAI && process.env.NODE_ENV !== 'production' && getOpenAIKey()) {
  (async () => {
    try {
      console.log('[DEV] Testing OpenAI connection for PDF generation...');
      const r = await fetch('https://api.openai.com/v1/models', {
        headers: {
          Authorization: `Bearer ${requireOpenAIKey()}`,
          'Content-Type': 'application/json',
        },
      });
      if (!r.ok) {
        const text = await r.text();
        console.error('[DEV] OpenAI test failed:', r.status, text);
      } else {
        const data = (await r.json()) as { data: Array<{ id: string }> };
        console.log(`[DEV] OpenAI OK. Models available: ${data.data.length}`);
      }
    } catch (e) {
      console.error('[DEV] OpenAI test error:', e);
    }
  })();
}

// ---- AWS S3 (optional) ----
const s3Client = process.env.AWS_ACCESS_KEY_ID
  ? new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    })
  : null;

// ---- Story splitting ----
function splitStoryIntoSections(story: string, numSections = 5): string[] {
  let cleanStory = story.replace(/===CHOICE POINT===[\s\S]*?===END CHOICE POINT===/g, '');
  cleanStory = cleanStory.replace(/===OPTION A OUTCOME===[\s\S]*?===END OPTION A OUTCOME===/g, '');
  cleanStory = cleanStory.replace(/===OPTION B OUTCOME===[\s\S]*?===END OPTION B OUTCOME===/g, '');

  const paragraphs = cleanStory.split(/\n\n+/).filter((p) => p.trim().length > 0);

  if (paragraphs.length < numSections) {
    const sentences = cleanStory.match(/[^\.!\?]+[\.!\?]+/g) || [];
    const sectionLen = Math.max(Math.floor(sentences.length / numSections), 1);
    const sections: string[] = [];
    for (let i = 0; i < sentences.length; i += sectionLen) {
      sections.push(sentences.slice(i, i + sectionLen).join(' '));
      if (sections.length >= numSections) break;
    }
    return sections;
  }

  const sectionLen = Math.max(Math.floor(paragraphs.length / numSections), 1);
  const sections: string[] = [];
  for (let i = 0; i < paragraphs.length; i += sectionLen) {
    sections.push(paragraphs.slice(i, i + sectionLen).join('\n\n'));
    if (sections.length >= numSections) break;
  }
  return sections;
}

// ---- OpenAI (DALL·E) direct fetch helpers (optional) ----
async function generateDallEImage(prompt: string): Promise<Buffer | null> {
  try {
    const apiKey = requireOpenAIKey(); // will throw if missing
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI (images) error:', response.status, errorData);
      throw new Error(`DALL·E API error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data?.data?.[0]?.url;
    if (!imageUrl) throw new Error('No image URL returned from DALL·E');

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error(`Failed to download image: ${imageResponse.status}`);

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length === 0) throw new Error('Downloaded image is empty');

    return buffer;
  } catch (error) {
    console.error('DALL·E image generation failed:', error);
    return null;
  }
}

async function generateImageDescription(section: string, hero: string, place: string): Promise<string> {
  try {
    const apiKey = requireOpenAIKey(); // will throw if missing
    const prompt = `Create a detailed illustration prompt for a children's storybook featuring ${hero} in ${place}.

Story section: "${section}"

Create a vibrant, colorful, clear illustration description that captures the key moment from this scene.
Focus on the main character and action.
Make it child-friendly, cute, and visually engaging.
Start with "A colorful storybook illustration of" and keep it under 100 words.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              "You are a children's book illustrator who writes beautiful, concise prompt descriptions for DALL·E.",
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error(`GPT-4o error: ${response.status}`);

    const data = await response.json();
    const description =
      data?.choices?.[0]?.message?.content?.trim() ||
      `A colorful storybook illustration of ${hero} in ${place}, in a whimsical style appropriate for children.`;
    return description;
  } catch (error) {
    console.error('Error generating image description:', error);
    return `A colorful storybook illustration of ${hero} in ${place}, in a whimsical style appropriate for children.`;
  }
}

// ---- Title helper ----
function formatStoryTitle(hero: string, place?: string, mission?: string): string {
  let storyTitle = `${hero}'s Adventure`;
  if (place && place.toLowerCase() !== 'magical world') storyTitle += ` in the ${place}`;
  if (mission && mission.toLowerCase() !== 'adventure') storyTitle += `: ${mission}`;
  return storyTitle;
}

// ---- OpenAI Images via SDK (optional path used inside generateImage) ----
async function generateImage(prompt: string): Promise<Buffer | null> {
  try {
    const openai = getOpenAI(); // will throw if key missing
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    const imageUrl = response?.data?.[0]?.url;
    if (!imageUrl) throw new Error('No image URL returned from DALL·E');

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error(`Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`);

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length === 0) throw new Error('Downloaded image is empty');

    return buffer;
  } catch (error) {
    console.error('Error generating image with DALL·E (SDK):', error);
    return null;
  }
}

// ---- Placeholder image ----
async function getPlaceholderImage(hero?: string, section?: number, total?: number): Promise<Buffer> {
  try {
    const width = 800;
    const height = 800;

    const schemes = [
      { bg1: '#9471DA', bg2: '#6FADCF', bg3: '#B39DDB', text: '#6A42B0' },
      { bg1: '#F48FB1', bg2: '#CE93D8', bg3: '#FF80AB', text: '#AD1457' },
      { bg1: '#81C784', bg2: '#4DB6AC', bg3: '#A5D6A7', text: '#2E7D32' },
      { bg1: '#FFB74D', bg2: '#FFA726', bg3: '#FFCC80', text: '#E65100' },
      { bg1: '#64B5F6', bg2: '#42A5F5', bg3: '#90CAF9', text: '#1565C0' },
      { bg1: '#9575CD', bg2: '#7E57C2', bg3: '#B39DDB', text: '#4527A0' },
    ];

    const idx = typeof section === 'number' && typeof total === 'number' ? section % schemes.length : 0;
    const scheme = schemes[idx];
    const heroName = hero || 'Story';
    const sectionText =
      typeof section === 'number' && typeof total === 'number'
        ? section === 0
          ? 'Cover Image'
          : `Section ${section} of ${total}`
        : '';

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${scheme.bg1}" />
            <stop offset="50%" stop-color="${scheme.bg2}" />
            <stop offset="100%" stop-color="${scheme.bg3}" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#grad)" />
        <circle cx="${width/2}" cy="${height/2 - 100}" r="150" fill="#FFFFFF" opacity="0.8" />
        <text x="${width/2}" y="${height/2 - 100}" font-family="Arial" font-size="60" text-anchor="middle" fill="${scheme.text}" font-weight="bold">Magic Story</text>
        <text x="${width/2}" y="${height/2 - 20}" font-family="Arial" font-size="40" text-anchor="middle" fill="${scheme.text}">${heroName}</text>
        ${sectionText ? `<text x="${width/2}" y="${height/2 + 50}" font-family="Arial" font-size="30" text-anchor="middle" fill="${scheme.text}">${sectionText}</text>` : ''}
        <text x="${width/2}" y="${height/2 + 200}" font-family="Arial" font-size="24" text-anchor="middle" fill="#FFFFFF">Illustration will appear in the final version</text>
      </svg>
    `;

    return await sharp(Buffer.from(svg)).resize(width, height).png().toBuffer();
  } catch (e) {
    console.error('Error creating SVG placeholder:', e);
    // solid color fallback
    return await sharp({
      create: { width: 800, height: 800, channels: 4, background: { r: 105, g: 132, b: 242, alpha: 1 } },
    })
      .png()
      .toBuffer();
  }
}

// ---- Optimize image for PDF ----
async function optimizeImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    return await sharp(imageBuffer).resize({ width: 800, height: 800, fit: 'inside' }).jpeg({ quality: 85 }).toBuffer();
  } catch (error) {
    console.error('Error optimizing image:', error);
    return imageBuffer;
  }
}

// ---- Create PDF ----
async function createPDF(storyTitle: string, story: string, sections: string[], images: Buffer[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true, autoFirstPage: false });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Title page
      doc.addPage();
      doc.font('Helvetica-Bold').fontSize(24).text(storyTitle, { align: 'center' }).moveDown(2);
      if (images[0]) {
        try {
          doc.image(images[0], { fit: [500, 500], align: 'center', valign: 'center' });
        } catch (e) {
          console.error('Cover image add error:', e);
        }
      }

      // TOC
      doc.addPage();
      doc.font('Helvetica-Bold').fontSize(18).text('Table of Contents', { align: 'center' }).moveDown(1);
      doc.font('Helvetica').fontSize(12);
      doc.text('Cover Page', { align: 'left', link: '1', underline: true }).moveDown(0.5);
      for (let i = 0; i < sections.length; i++) {
        doc.text(`Section ${i + 1}`, { align: 'left', link: String(i + 2), underline: true }).moveDown(0.5);
      }
      doc.text('Complete Story', { align: 'left', link: String(sections.length + 2), underline: true }).moveDown(0.5);

      // Sections
      for (let i = 0; i < sections.length; i++) {
        doc.addPage();
        doc.font('Helvetica-Bold').fontSize(16).text(`Section ${i + 1}`, { align: 'center' }).moveDown(1);
        doc.font('Helvetica').fontSize(12).text(sections[i], { align: 'left', paragraphGap: 10 }).moveDown(2);

        if (i + 1 < images.length && images[i + 1]) {
          try {
            doc.image(images[i + 1], { fit: [500, 300], align: 'center', valign: 'center' });
          } catch (e) {
            console.error(`Image ${i + 1} add error:`, e);
            doc.text('[ Image not available ]', { align: 'center' });
          }
        }
      }

      // Appendix: full story
      doc.addPage();
      doc.font('Helvetica-Bold').fontSize(18).text('Complete Story', { align: 'center' }).moveDown(1);
      const paragraphs = story.split(/\n\n+/).filter((p) => p.trim().length > 0);
      doc.font('Helvetica').fontSize(12);
      paragraphs.forEach((p, idx) => {
        doc.text(p, { align: 'left' });
        if (idx < paragraphs.length - 1) doc.moveDown(1);
      });

      // Page numbers
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc.font('Helvetica').fontSize(8).text(`Page ${i + 1} of ${pageCount}`, doc.page.margins.left, doc.page.height - 30, {
          align: 'center',
        });
      }

      // Footer note
      doc.switchToPage(pageCount - 1);
      doc.font('Helvetica-Oblique').fontSize(9).text('Created with Magic Story Buddy', doc.page.margins.left, doc.page.height - 50, {
        align: 'center',
      });

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}

// ---- Save PDF (S3 or local temp) ----
async function savePDF(pdfBuffer: Buffer, filename: string): Promise<string> {
  if (s3Client) {
    const bucket = process.env.AWS_S3_BUCKET || 'magic-story-buddy';
    await s3Client.send(
      new PutObjectCommand({ Bucket: bucket, Key: `pdfs/${filename}`, Body: pdfBuffer, ContentType: 'application/pdf' })
    );
    const url = await getSignedUrl(s3Client, new GetObjectCommand({ Bucket: bucket, Key: `pdfs/${filename}` }), {
      expiresIn: 3600,
    });
    return url;
  } else {
    const tempDir = path.join(os.tmpdir(), 'magic-story-buddy');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const filePath = path.join(tempDir, filename);
    fs.writeFileSync(filePath, pdfBuffer);
    return `/api/download-pdf?filename=${encodeURIComponent(filename)}`;
  }
}

// ---- POST handler ----
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { story, hero, place, mission } = data;

    if (!story) {
      return NextResponse.json({ error: 'Story content is required' }, { status: 400 });
    }

    const storyTitle = formatStoryTitle(hero, place, mission);
    console.log(`Generating PDF for "${storyTitle}"`);

    const sections = splitStoryIntoSections(story, 5);
    console.log(`Split story into ${sections.length} sections for illustrations`);

    const images: Buffer[] = [];

    // Cover
    let cover: Buffer | null = null;

    // If OpenAI enabled AND a key exists, try real images, else placeholders
    const hasKey = !!getOpenAIKey();
    if (ENABLE_OPENAI && hasKey) {
      try {
        // Optional: generate a nicer cover by asking GPT for a description, then DALL·E
        const coverDesc = await generateImageDescription(sections[0] || story, hero || 'Hero', place || 'a magical world');
        cover = (await generateImage(coverDesc)) || (await generateDallEImage(coverDesc));
      } catch (e) {
        console.error('Cover image generation failed; using placeholder.', e);
      }
    }

    if (!cover) cover = await getPlaceholderImage(`${hero || 'Hero'}'s Adventure`, 0, sections.length);
    images.push(cover);

    // Section images
    for (let i = 0; i < sections.length; i++) {
      let img: Buffer | null = null;
      if (ENABLE_OPENAI && hasKey) {
        try {
          const desc = await generateImageDescription(sections[i], hero || 'Hero', place || 'a magical world');
          img = (await generateImage(desc)) || (await generateDallEImage(desc));
          if (img) img = await optimizeImage(img);
        } catch (e) {
          console.error(`Section ${i + 1} image gen failed; using placeholder.`, e);
        }
      }
      if (!img) img = await getPlaceholderImage(hero || 'Hero', i + 1, sections.length);
      images.push(img);
    }

    // Create and save PDF
    const pdfBuffer = await createPDF(storyTitle, story, sections, images);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeTitle = storyTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const filename = `${safeTitle}-${timestamp}.pdf`;

    console.log('Saving PDF file:', filename);
    const pdfUrl = await savePDF(pdfBuffer, filename);

    return NextResponse.json({ pdfUrl });
  } catch (error: any) {
    console.error('Error generating PDF:', error);

    // Return helpful auth-specific message if it looks like a key problem
    const msg = String(error?.message || '');
    if (/(authentication|api key|401|unauthorized)/i.test(msg)) {
      return NextResponse.json(
        {
          error: 'OpenAI API key authentication failed or is missing.',
          suggestion:
            'Set OPENAI_API_KEY in .env.local (dev) and in Vercel Project Settings → Environment Variables (prod), or disable ENABLE_OPENAI.',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: error?.message || 'Failed to generate PDF',
        suggestion: "The PDF feature can run without OpenAI (placeholders shown). Enable OPENAI_API_KEY to use DALL·E.",
      },
      { status: 500 }
    );
  }
}
