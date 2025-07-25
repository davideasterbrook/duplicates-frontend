import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Required for static export compatibility
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const imagesDirectory = path.join(process.cwd(), 'public', 'example-nft-images');
    
    // Check if directory exists
    if (!fs.existsSync(imagesDirectory)) {
      return NextResponse.json({ 
        images: [],
        message: 'Example images directory not found' 
      });
    }

    // Read directory contents
    const files = fs.readdirSync(imagesDirectory);
    
    // Filter for image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    // Sort files for consistent ordering
    imageFiles.sort();

    // Map to the format expected by the frontend
    const images = imageFiles.map((filename, index) => ({
      src: `/example-nft-images/${filename}`,
      alt: `Example NFT ${index + 1}`,
      name: path.parse(filename).name.replace(/[-_]/g, ' '), // Clean up filename for display
      filename
    }));

    return NextResponse.json({ 
      images,
      count: images.length,
      message: `Found ${images.length} example images`
    });

  } catch (error) {
    console.error('Error reading example images directory:', error);
    
    return NextResponse.json(
      { 
        images: [],
        error: 'Failed to read example images directory',
        message: 'Server error occurred while fetching images'
      },
      { status: 500 }
    );
  }
} 