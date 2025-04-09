/** @type {import('next').NextConfig} */
  const nextConfig = {
    experimental: {
      staleTimes: {
        dynamic: 30, 
        // 30 seconds for dynamic pages (pages that are generated at runtime)
        // this means the page will be stale for 30 seconds
        // and then the page will be revalidated
        // this is useful for pages that are not frequently updated
        // and for pages that are not critical to the user experience
        // this is also useful for pages that are not critical to the user experience
      },
    },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
    ],
  },
  rewrites: () => {
    return [
      {
        source: "/hashtag/:tag",
        destination: "/search?q=%23:tag",
      },
    ];
  },
};

export default nextConfig;
