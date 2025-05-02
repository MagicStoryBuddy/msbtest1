/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure image domains for OpenAI image URLs
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net'],
  },
  
  // Use serverExternalPackages instead of deprecated serverComponentsExternalPackages
  serverExternalPackages: ['sharp', 'pdfkit'],
  
  // Configure server actions for larger payloads
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig; 