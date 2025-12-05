// next.config.ts
import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  // ★ オプションは一旦"空"にして通す（後で足す）
  options: {},
});
const nextConfig = {
  output: 'export',  // これを追加
  // 画像最適化を使っている場合は以下も必要（サーバー側で変換できないため）
  images: {
    unoptimized: true,
  },
};
module.exports = nextConfig;
