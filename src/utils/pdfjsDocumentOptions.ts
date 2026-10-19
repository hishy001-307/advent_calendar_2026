import { absoluteBrowserPublicUrl } from "@/utils/publicPath";

/** pdf.js は `cMapUrl + "Adobe-Japan1-UCS2.bcmap"` のように連結するため末尾 `/` が必須 */
function dirPublicUrl(absoluteDir: string): string {
  const url = absoluteBrowserPublicUrl(absoluteDir);
  return url.endsWith("/") ? url : `${url}/`;
}

/** pdf.js で日本語・中国語・韓国語の埋め込みフォントを描画するための共通オプション */
export function pdfjsDocumentOptions(
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    cMapUrl: dirPublicUrl("/pdfjs/cmaps/"),
    cMapPacked: true,
    standardFontDataUrl: dirPublicUrl("/pdfjs/standard_fonts/"),
    ...extra,
  };
}
