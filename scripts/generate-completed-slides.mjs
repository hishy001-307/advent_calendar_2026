#!/usr/bin/env node
/**
 * `public/{teamSlug}/{slug}.pdf` と `public/_meta.json` から
 * `src/data/completedSlides.gen.ts` を生成します。
 *
 * 実行: npm run gen:slides
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import {
  TEAM_SLUGS,
  baseSlugFromStem,
  cleanMetaString,
  titleFromFilename,
} from "./completed-slides-lib.mjs";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");
const metaFile = path.join(publicDir, "_meta.json");
const outFile = path.join(root, "src", "data", "completedSlides.gen.ts");

async function extractPdfAuthor(buffer) {
  const data = await pdfParse(buffer, { max: 1 });
  const info = data?.info && typeof data.info === "object" ? data.info : {};
  return cleanMetaString(info.Author);
}

function loadMetaMap() {
  if (!fs.existsSync(metaFile)) return new Map();
  const raw = JSON.parse(fs.readFileSync(metaFile, "utf8"));
  const slides = Array.isArray(raw?.slides) ? raw.slides : [];
  const map = new Map();
  for (const row of slides) {
    if (!row?.teamSlug || !row?.slug) continue;
    map.set(`${row.teamSlug}\0${row.slug}`, row);
  }
  return map;
}

async function main() {
  if (!fs.existsSync(publicDir)) {
    console.error("missing", publicDir);
    process.exit(1);
  }

  const metaByKey = loadMetaMap();
  const records = [];
  const usedSlugsByTeam = new Map();

  const folders = fs
    .readdirSync(publicDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && TEAM_SLUGS.has(d.name))
    .map((d) => d.name)
    .sort();

  for (const teamSlug of folders) {
    const dir = path.join(publicDir, teamSlug);
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith(".pdf"))
      .sort((a, b) => a.localeCompare(b, "ja"));

    for (const file of files) {
      const stem = path.basename(file, ".pdf");
      const abs = path.join(dir, file);
      const rel = `/${teamSlug}/${file}`.split(path.sep).join("/");

      let slug = baseSlugFromStem(stem);
      if (!usedSlugsByTeam.has(teamSlug)) usedSlugsByTeam.set(teamSlug, new Set());
      const set = usedSlugsByTeam.get(teamSlug);
      if (set.has(slug) && file !== `${slug}.pdf`) {
        console.warn("slug/filename mismatch", rel, "expected", `${slug}.pdf`);
      }
      let unique = slug;
      let n = 2;
      while (set.has(unique)) {
        unique = `${slug}-${n}`;
        n += 1;
      }
      set.add(unique);
      slug = unique;

      const meta = metaByKey.get(`${teamSlug}\0${slug}`);
      let title = meta?.title ?? titleFromFilename(file);
      let author = meta?.author ?? undefined;

      let buffer;
      try {
        buffer = fs.readFileSync(abs);
      } catch (e) {
        console.warn("read fail", rel, e.message);
        continue;
      }

      try {
        const authorMeta = await extractPdfAuthor(buffer);
        if (authorMeta) author = authorMeta;
      } catch (e) {
        console.warn("pdf-parse fail", rel, e.message);
      }

      if (author && author.length > 120) author = author.slice(0, 120);

      records.push({
        teamSlug,
        folderLabel: teamSlug,
        slug,
        pdfPath: rel,
        title,
        author: author || null,
        sourceFile: meta?.sourceFile ?? file,
      });
    }
  }

  records.sort((a, b) => {
    if (a.teamSlug !== b.teamSlug) return a.teamSlug.localeCompare(b.teamSlug);
    return a.pdfPath.localeCompare(b.pdfPath, "ja");
  });

  const header = `/* eslint-disable */
/**
 * ⚠️ 自動生成（編集しない）
 * 再生成: \`npm run gen:slides\`
 * PDF 配置: \`public/{teamSlug}/{slug}.pdf\`
 */
import type { TeamSlug } from "@/data/finishedPosters";

export type CompletedSlideRecord = {
  teamSlug: TeamSlug;
  folderLabel: string;
  slug: string;
  /** public からの絶対パス（先頭 /、basePath 除く） */
  pdfPath: string;
  title: string;
  author: string | null;
  sourceFile: string;
};

`;

  const body = `export const COMPLETED_SLIDES: CompletedSlideRecord[] = ${JSON.stringify(
    records,
    null,
    2,
  )};
`;

  fs.writeFileSync(outFile, header + body, "utf8");
  console.log("wrote", outFile, "count=", records.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
