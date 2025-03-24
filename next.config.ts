import type { NextConfig } from "next";


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.builder.io","cdn.pixabay.com","tse1.mm.bing.net"],
  },
};

module.exports = nextConfig;


export default nextConfig;
