/**
 * Video URL configuration
 * 
 * For production, upload videos to Cloudinary and set these environment variables:
 * - NEXT_PUBLIC_HERO_VIDEO_URL
 * - NEXT_PUBLIC_RIGHT_VIDEO_URL
 * 
 * For local development, videos will be served from /public/gallery/
 */

// Helper function to convert Cloudinary URL to MP4 format
function convertToMp4(url: string): string {
  // If it's already a Cloudinary URL with format, return as is
  if (url.includes('/f_mp4/') || url.includes('/f_webm/')) {
    return url;
  }
  
  // If it's a Cloudinary URL, add format transformation to convert to MP4
  if (url.includes('res.cloudinary.com')) {
    // Example: https://res.cloudinary.com/dvraokarg/video/upload/v1768594386/HeroVideo_vqpe1l.mov
    // Becomes: https://res.cloudinary.com/dvraokarg/video/upload/f_mp4/v1768594386/HeroVideo_vqpe1l
    // Remove .mov extension and add f_mp4 transformation before the version
    const mp4Url = url.replace(/\/upload\/(v\d+\/)/, '/upload/f_mp4/$1').replace(/\.mov$/, '');
    return mp4Url;
  }
  
  return url;
}

export const videoUrls = {
  // Main hero background video (converted to MP4 for browser compatibility)
  heroVideo: process.env.NEXT_PUBLIC_HERO_VIDEO_URL 
    ? convertToMp4(process.env.NEXT_PUBLIC_HERO_VIDEO_URL)
    : convertToMp4('https://res.cloudinary.com/dvraokarg/video/upload/v1768594386/HeroVideo_vqpe1l.mov'),
  
  // Right side video (if needed)
  rightVideo: process.env.NEXT_PUBLIC_RIGHT_VIDEO_URL 
    ? convertToMp4(process.env.NEXT_PUBLIC_RIGHT_VIDEO_URL)
    : convertToMp4('https://res.cloudinary.com/dvraokarg/video/upload/v1768594386/HeroVideo_vqpe1l.mov'),
};

/**
 * Get Cloudinary video URL with transformations
 * @param publicId - Cloudinary public ID
 * @param transformations - Optional transformations object
 */
export function getCloudinaryVideoUrl(
  publicId: string,
  transformations?: {
    quality?: 'auto' | number;
    format?: 'mp4' | 'webm';
    width?: number;
    height?: number;
  }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set, using local video');
    return `/gallery/${publicId}`;
  }
  
  const baseUrl = `https://res.cloudinary.com/${cloudName}/video/upload`;
  const transformParams: string[] = [];
  
  if (transformations) {
    if (transformations.quality) {
      transformParams.push(`q_${transformations.quality}`);
    }
    if (transformations.format) {
      transformParams.push(`f_${transformations.format}`);
    }
    if (transformations.width) {
      transformParams.push(`w_${transformations.width}`);
    }
    if (transformations.height) {
      transformParams.push(`h_${transformations.height}`);
    }
  }
  
  const transformString = transformParams.length > 0 
    ? `${transformParams.join(',')}/` 
    : '';
  
  return `${baseUrl}/${transformString}${publicId}`;
}
