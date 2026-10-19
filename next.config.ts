import type { NextConfig } from "next";

// 静的エクスポート: `npm run build`（または `npm run export`）のたびに
// 公開用の HTML / JS / CSS と public/ の資産がプロジェクト直下の `out/` に書き出されます。
// （`out/` は .gitignore されているため、デプロイ時はビルド成果物をホスティングにアップロードしてください。）

const isProduction = process.env.NODE_ENV === "production";

/** GitHub Pages 等の公開 URL プレフィックス（本番ビルド・`npm run start` のみ） */
const siteBasePath = "/physlab2026";

// `output: "export"` は本番ビルダー（`next build`）だけで有効にする。
// 開発（`next dev`）でも有効にすると、プリレンダ対象の検証が厳しくなり、
// `generateStaticParams` に載っているはずの `[slug]` でも 500 になることがある（Next 16 系）。
//
// basePath も本番のみ有効にする。dev で basePath を付けると
// `/physlab2026/teams/.../slides/...` が 404 になる（Next 16 dev の既知の挙動）。
// 開発時は http://localhost:3000/teams/... で開く。

const devOnlyRedirects: Pick<NextConfig, "redirects"> = {
  /** 本番 URL のブックマーク（/physlab2026/...）を dev の正しいパスへ */
  async redirects() {
    const b = siteBasePath;
    const noBase = { basePath: false } as const;
    return [
      {
        source: `${b}`,
        destination: "/",
        permanent: false,
        ...noBase,
      },
      {
        source: `${b}/:path*`,
        destination: "/:path*",
        permanent: false,
        ...noBase,
      },
    ];
  },
};

const nextConfig: NextConfig = {
  ...(isProduction ? { output: "export" as const } : {}),
  ...(!isProduction ? devOnlyRedirects : {}),
  trailingSlash: true,
  ...(isProduction
    ? {
        basePath: siteBasePath,
        env: {
          NEXT_PUBLIC_STATIC_BASE_PATH: siteBasePath,
        },
      }
    : {
        env: {
          NEXT_PUBLIC_STATIC_BASE_PATH: "",
        },
      }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
