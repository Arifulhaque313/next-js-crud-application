import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env:{
    server: 'http://localhost:8000/api'
  }
};

export default nextConfig;
