/**
 * 解説資料 PDF（`public/{teamSlug}/{slug}.pdf`）のスラッグ生成・班対応
 */
export const FOLDER_TO_TEAM = {
  素粒子: "particle",
  物性: "condensed-matter",
  宇宙班: "astrophysics",
  計算数理: "computational-math",
  生物: "biophysics",
  実験: "experimental",
};

export const TEAM_SLUGS = new Set(Object.values(FOLDER_TO_TEAM));

export const TEAM_SLUG_LIST = [...TEAM_SLUGS].sort();

export function baseSlugFromStem(stem) {
  let s = stem
    .normalize("NFKC")
    .replace(/\.pdf$/i, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\u3005\u3040-\u30FF\u4E00-\u9FFF-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!s) s = "slide";
  s = s.length > 96 ? s.slice(0, 96) : s;
  return s.normalize("NFC");
}

export function titleFromFilename(file) {
  let title = file.replace(/\.pdf$/i, "").normalize("NFKC").trim();
  return title || file;
}

export function cleanMetaString(s) {
  if (s == null || typeof s !== "string") return "";
  let t = s.replace(/\u0000/g, "").trim();
  if (/^[\x00-\x7F]*$/.test(t) && /^[\s\d:;,.-]+$/.test(t)) return "";
  return t;
}
