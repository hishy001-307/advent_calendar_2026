/**
 * `next build`（output: export + basePath: /physlab2026）の out/ をローカルで配信する。
 *
 * 1. ブラウザの URL を常に /physlab2026/... に合わせる（未付きの / や /teams/... は 302 で付与）。
 *    これが無いとトップが 200 でもクライアント側が 404 になる。
 * 2. リクエストから先頭の /physlab2026 を除いて from disk（out/）を解決する。
 */
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import handler from "serve-handler";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "out");
const BASE = process.env.EXPORT_BASE_PATH ?? "/physlab2026";
const PORT = Number(process.env.PORT ?? 3000);

/** @param {string} pathname */
function stripBasePath(pathname) {
  if (pathname === BASE || pathname === `${BASE}/`) return "/";
  if (pathname.startsWith(`${BASE}/`)) {
    const rest = pathname.slice(BASE.length);
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return pathname;
}

/** basePath 無しで来た要求はアプリの想定 URL とずれるので付与する */
/** @param {string} pathname */
function needsBasePathRedirect(pathname) {
  if (pathname === BASE || pathname.startsWith(`${BASE}/`)) return false;
  return true;
}

/** リクエスト URL の各セグメントをデコード（日本語 PDF パス用）。 */
/** @param {string} pathname */
function decodePathnameForFileLookup(pathname) {
  return pathname
    .split("/")
    .map((seg) => {
      if (!seg) return seg;
      try {
        return decodeURIComponent(seg);
      } catch {
        return seg;
      }
    })
    .join("/");
}

const server = http.createServer((request, response) => {
  const host = request.headers.host ?? "localhost";
  const url = new URL(request.url ?? "/", `http://${host}`);
  const pathname = url.pathname;

  if (
    (request.method === "GET" || request.method === "HEAD") &&
    needsBasePathRedirect(pathname)
  ) {
    const targetPath =
      pathname === "/" || pathname === "" ? `${BASE}/` : `${BASE}${pathname}`;
    const location = `${targetPath}${url.search}`;
    response.writeHead(302, { Location: location });
    response.end();
    return;
  }

  const nextPath = decodePathnameForFileLookup(stripBasePath(pathname));
  request.url = `${nextPath}${url.search}`;
  return handler(request, response, {
    public: outDir,
    trailingSlash: true,
  });
});

server.listen(PORT, () => {
  console.error(`out/ を http://localhost:${PORT}${BASE}/ から開いてください`);
});
