const base = process.env.NEXT_PUBLIC_STATIC_BASE_PATH ?? "";

/**
 * `public/` 直下の静的ファイル用 URL。`basePath` 配下でホストする場合に必要。
 * `next/link` は basePath を付与するが、`next/image` のルート相対 src は静的エクスポートでは付与されないことがある。
 */
export function publicPath(absolutePath: string): string {
  const path = absolutePath.startsWith("/") ? absolutePath : `/${absolutePath}`;
  if (!base) return path;
  return `${base}${path}`;
}
