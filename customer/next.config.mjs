/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            hostname: "static.nike.com",
            protocol: "https",
          },
          {
            hostname: "firebasestorage.googleapis.com",
            protocol: "https",
          },
          {
            hostname: "github.com",
            protocol: "https",
          },
          {
            hostname: "danviet.mediacdn.vn",
            protocol: "https",
          },
          {
            hostname: "th.bing.com",
            protocol: "https"
          }
        ],
      },
};

export default nextConfig;
