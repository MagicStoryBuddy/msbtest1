import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function GET(request: NextRequest) {
  try {
    // Get filename from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }
    
    // Ensure the filename doesn't contain path traversal attempts
    const sanitizedFilename = path.basename(filename);
    
    // Construct the full path to the file
    const tempDir = path.join(os.tmpdir(), 'magic-story-buddy');
    const filePath = path.join(tempDir, sanitizedFilename);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Create a new response with the file content
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${sanitizedFilename}"`,
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error: any) {
    console.error('Error serving PDF:', error);
    return NextResponse.json({ error: error.message || 'Failed to serve PDF' }, { status: 500 });
  }
} 