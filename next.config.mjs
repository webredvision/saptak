import dotenv from "dotenv";
import path from "path";
const envPath = path.resolve("/rvdata/secrets/saptak/.env");
dotenv.config({
  path: envPath,
});
// Fallback for local development if the server path doesn't exist
if (process.env.MONGODB_URI === undefined) {
  dotenv.config({ path: path.resolve(".env") });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mongoose"],
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "redvisionweb.com",
      },
      {
        protocol: "https",
        hostname: "www.redvisiontechnologies.com",
      },
      {
        protocol: "https",
        hostname: "www.twtf.org.uk",
      },
    ],
    localPatterns: [
      {
        pathname: "/api/uploads",
      },
      {
        pathname: "/images/**",
      },
      {
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
