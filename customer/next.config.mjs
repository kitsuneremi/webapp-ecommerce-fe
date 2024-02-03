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
            hostname: "i.ebayimg.com",
            protocol: "https",
          },
          {
            hostname: "ae01.alicdn.com",
            protocol: "https",
          },
          {
            hostname: "th.bing.com",
            protocol: "https"
          },{
            hostname: "theme.hstatic.net",
            protocol: "https"
          },{
            hostname: "product.hstatic.net",
            protocol: "https"
          },{
            hostname: "www.gravatar.com",
            protocol: "https"
          }
        ],
      },
};

export default nextConfig;
