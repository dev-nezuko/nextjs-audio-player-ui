/** @type {import('next').NextConfig} */
const nextConfig = {
  // Artwork is shown as-is; the built-in image optimizer endpoint stays off.
  images: { unoptimized: true },
};

export default nextConfig;
