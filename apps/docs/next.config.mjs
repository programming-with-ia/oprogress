import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['@workspace/ui', '@oprogress/core', '@oprogress/react', '@oprogress/next'],
};

export default withMDX(config);
