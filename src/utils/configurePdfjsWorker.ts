import { absoluteBrowserPublicUrl } from "@/utils/publicPath";

/** 同一セッションでワーカー URL を再利用 */
let workerSrcPromise: Promise<string> | null = null;

/**
 * Apache 等が `.mjs` を `text/plain` で返すと pdf.js ワーカーが起動しない。
 * スクリプトを取得して Blob URL（正しい MIME）で渡す。
 */
export function configurePdfjsWorker(
  pdfjs: typeof import("pdfjs-dist"),
): Promise<void> {
  if (!workerSrcPromise) {
    workerSrcPromise = (async () => {
      const workerPath = absoluteBrowserPublicUrl("/pdfjs/pdf.worker.mjs");
      const res = await fetch(workerPath);
      if (!res.ok) {
        throw new Error(`pdf.worker fetch ${res.status}`);
      }
      const script = await res.text();
      const blob = new Blob([script], { type: "application/javascript" });
      return URL.createObjectURL(blob);
    })();
  }

  return workerSrcPromise.then((src) => {
    pdfjs.GlobalWorkerOptions.workerSrc = src;
  });
}
