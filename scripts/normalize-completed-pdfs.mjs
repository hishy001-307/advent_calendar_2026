#!/usr/bin/env node
/**
 * 解説資料 PDF を `public/{teamSlug}/{slug}.pdf` に揃え、`public/_meta.json` を書き出す。
 *
 * - `public/完成/...` が残っていれば `public/{teamSlug}/` へ移動してから削除
 * - 旧 `public/完成/{班ラベル}/` 形式も同様に処理
 *
 * 実行: npm run normalize:slides
 * 確認のみ: npm run normalize:slides -- --dry-run
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  FOLDER_TO_TEAM,
  TEAM_SLUGS,
  baseSlugFromStem,
  titleFromFilename,
} from "./completed-slides-lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");
const legacyCompleteDir = path.join(publicDir, "完成");
const metaFile = path.join(publicDir, "_meta.json");
const dryRun = process.argv.includes("--dry-run");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function moveFile(src, dest) {
  if (dryRun) {
    console.log("[dry-run] move", src, "→", dest);
    return;
  }
  ensureDir(path.dirname(dest));
  if (fs.existsSync(dest)) fs.unlinkSync(dest);
  fs.renameSync(src, dest);
}

function removeEmptyDir(dir) {
  if (!fs.existsSync(dir)) return;
  if (fs.readdirSync(dir).length === 0) {
    if (dryRun) console.log("[dry-run] rmdir", dir);
    else fs.rmdirSync(dir);
  }
}

function ingestPdf(teamSlug, file, srcPath, slides, usedSlugsByTeam) {
  const stem = path.basename(file, ".pdf");
  let slug = baseSlugFromStem(stem);
  if (!usedSlugsByTeam.has(teamSlug)) usedSlugsByTeam.set(teamSlug, new Set());
  const set = usedSlugsByTeam.get(teamSlug);
  let unique = slug;
  let n = 2;
  while (set.has(unique)) {
    unique = `${slug}-${n}`;
    n += 1;
  }
  set.add(unique);

  const dest = path.join(publicDir, teamSlug, `${unique}.pdf`);
  moveFile(srcPath, dest);
  if (!dryRun) fs.chmodSync(dest, 0o644);

  slides.push({
    teamSlug,
    slug: unique,
    title: titleFromFilename(file),
    author: null,
    sourceFile: file,
  });
}

function migrateLegacyCompleteDir(slides, usedSlugsByTeam) {
  if (!fs.existsSync(legacyCompleteDir)) return;

  const entries = fs.readdirSync(legacyCompleteDir, { withFileTypes: true });

  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const folder = ent.name;
    if (folder.startsWith("_")) continue;

    let teamSlug = TEAM_SLUGS.has(folder) ? folder : FOLDER_TO_TEAM[folder];
    if (!teamSlug) {
      console.warn("skip unknown folder under 完成:", folder);
      continue;
    }

    const srcDir = path.join(legacyCompleteDir, folder);
    const files = fs
      .readdirSync(srcDir)
      .filter((f) => f.toLowerCase().endsWith(".pdf"));

    for (const file of files) {
      ingestPdf(
        teamSlug,
        file,
        path.join(srcDir, file),
        slides,
        usedSlugsByTeam,
      );
    }

    removeEmptyDir(srcDir);
  }

  removeEmptyDir(legacyCompleteDir);
}

function collectFromPublicTeamDirs(slides, usedSlugsByTeam) {
  const existing = new Set(slides.map((s) => `${s.teamSlug}\0${s.slug}`));

  for (const teamSlug of [...TEAM_SLUGS].sort()) {
    const dir = path.join(publicDir, teamSlug);
    if (!fs.existsSync(dir)) continue;

    const files = fs
      .readdirSync(dir)
      .filter((f) => f.toLowerCase().endsWith(".pdf"));

    for (const file of files) {
      const stem = path.basename(file, ".pdf");
      const slug = baseSlugFromStem(stem);
      const key = `${teamSlug}\0${slug}`;
      if (existing.has(key)) continue;

      if (!usedSlugsByTeam.has(teamSlug)) usedSlugsByTeam.set(teamSlug, new Set());
      usedSlugsByTeam.get(teamSlug).add(slug);

      slides.push({
        teamSlug,
        slug,
        title: titleFromFilename(file),
        author: null,
        sourceFile: file,
      });
      existing.add(key);
    }
  }
}

function main() {
  const slides = [];
  const usedSlugsByTeam = new Map();

  migrateLegacyCompleteDir(slides, usedSlugsByTeam);
  collectFromPublicTeamDirs(slides, usedSlugsByTeam);

  slides.sort((a, b) => {
    if (a.teamSlug !== b.teamSlug) return a.teamSlug.localeCompare(b.teamSlug);
    return a.slug.localeCompare(b.slug, "ja");
  });

  const meta = { version: 1, slides };
  if (dryRun) {
    console.log("[dry-run] would write", metaFile, "count=", slides.length);
  } else {
    fs.writeFileSync(metaFile, `${JSON.stringify(meta, null, 2)}\n`, "utf8");
    console.log("wrote", metaFile, "count=", slides.length);
  }
}

main();
