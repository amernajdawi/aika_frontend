/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // Ensure the API URL has a protocol
    const fullApiUrl = apiUrl.startsWith('http') ? apiUrl : `https://${apiUrl}`;
    
    return [
      {
        source: '/api/:path*',
        destination: `${fullApiUrl}/:path*`,
      },
    ];
  },
}

module.exports = nextConfig 