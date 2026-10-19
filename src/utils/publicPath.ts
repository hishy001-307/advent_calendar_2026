const base = process.env.NEXT_PUBLIC_STATIC_BASE_PATH ?? "";

/**
 * `public/` 直下の静的ファイル用 URL（fetch・img 等）。
 * `next/link` の href には使わない（本番 basePath と二重になる）。
 */
export function publicPath(absolutePath: string): string {
  const path = absolutePath.startsWith("/") ? absolutePath : `/${absolutePath}`;
  if (!base) return path;
  return `${base}${path}`;
}

/**
 * パスを NFC に揃え、各セグメントを `encodeURIComponent` する。
 * 日本語ファイル名の PDF を `fetch` / iframe で確実に取得するため。
 */
function encodePathSegments(absolutePath: string): string {
  const path = absolutePath.startsWith("/") ? absolutePath : `/${absolutePath}`;
  const segments = path.normalize("NFC").split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  return `/${segments.map((seg) => encodeURIComponent(seg)).join("/")}`;
}

/**
 * ブラウザでの PDF 取得・ワーカー・ダウンロード用（basePath + 日本語パス対応エンコード）。
 */
export function browserPublicUrl(absolutePath: string): string {
  const encoded = encodePathSegments(absolutePath);
  if (!base) return encoded;
  return `${base.replace(/\/$/, "")}${encoded}`;
}

/**
 * pdf.js の cMap / ワーカー取得用。Blob ワーカー利用時も確実に本番 origin へ向ける。
 */
export function absoluteBrowserPublicUrl(absolutePath: string): string {
  const path = browserPublicUrl(absolutePath);
  if (typeof window === "undefined") return path;
  if (/^https?:\/\//i.test(path)) return path;
  return `${window.location.origin}${path}`;
}
