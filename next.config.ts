// next.config.ts
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  // ★ オプションは一旦“空”にして通す（後で足す）
  options: {},
});

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    // ★ Rust MDX ローダを無効化（JSローダを使う）
    mdxRs: false,
  },
};

export default withMDX(nextConfig);
