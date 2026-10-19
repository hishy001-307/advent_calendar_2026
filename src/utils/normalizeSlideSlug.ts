/**
 * slides `[slug]` のパス比較・プリレンダ登録で NFC に揃える（NFD だと同じ見た目でも文字列不一致になる）。
 */
export function normalizeSlideSlugParam(slug: string): string {
  return slug.normalize("NFC").trim();
}

/** ルート `params.slug` 用。静的 export では `%E3%81%8B` のようにエンコードされたまま渡ることがある。 */
export function decodeSlideSlugParam(slug: string): string {
  let raw = slug;
  if (raw.includes("%")) {
    try {
      raw = decodeURIComponent(raw);
    } catch {
      // 不正なエスケープはそのまま
    }
  }
  return normalizeSlideSlugParam(raw);
}

/**
 * `output: "export"` 用: 同じスラッグでも Unicode 正規形（NFC / NFD）で URL が分かれることがあるため、
 * 静的生成の `[slug]` を両方登録する。ページ側は `normalizeSlideSlugParam` で同一ポスターに解決する。
 */
export function slideSlugStaticParamVariants(slug: string): string[] {
  const nfc = normalizeSlideSlugParam(slug);
  const nfd = nfc.normalize("NFD");
  if (nfd === nfc) return [nfc];
  return [nfc, nfd];
}
