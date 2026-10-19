"use client";

import { useEffect, useState } from "react";
import { browserPublicUrl } from "@/utils/publicPath";
import { configurePdfjsWorker } from "@/utils/configurePdfjsWorker";
import { pdfjsDocumentOptions } from "@/utils/pdfjsDocumentOptions";
import styles from "./PosterPdfJsViewer.module.scss";

type PosterPdfJsViewerProps = {
  pdfPath: string;
  isDark: boolean;
  docTitle: string;
};

const MAX_PAGES = 48;
const RENDER_MAX_WIDTH_CSS = 980;

async function rasterizePdfToDataUrls(pdfPath: string): Promise<string[]> {
  const pdfjs = await import("pdfjs-dist");
  await configurePdfjsWorker(pdfjs);

  const res = await fetch(browserPublicUrl(pdfPath));
  if (!res.ok) {
    throw new Error(`PDF の取得に失敗しました (${res.status})`);
  }
  const data = new Uint8Array(await res.arrayBuffer());

  const pdf = await pdfjs.getDocument({ data, ...pdfjsDocumentOptions() }).promise;
  const out: string[] = [];
  const n = Math.min(pdf.numPages, MAX_PAGES);

  try {
    for (let i = 1; i <= n; i += 1) {
      const page = await pdf.getPage(i);
      const base = page.getViewport({ scale: 1 });
      const scale = RENDER_MAX_WIDTH_CSS / base.width;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const w = Math.floor(viewport.width);
      const h = Math.floor(viewport.height);
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas context");
      const renderTask = page.render({
        canvasContext: ctx,
        viewport,
      });
      await renderTask.promise;
      out.push(canvas.toDataURL("image/jpeg", 0.88));
    }
  } finally {
    await pdf.cleanup();
  }

  return out;
}

export default function PosterPdfJsViewer({
  pdfPath,
  isDark,
  docTitle,
}: PosterPdfJsViewerProps) {
  const [pages, setPages] = useState<string[] | null>(null);
  const [failed, setFailed] = useState(false);
  const src = browserPublicUrl(pdfPath);

  useEffect(() => {
    let cancelled = false;
    void rasterizePdfToDataUrls(pdfPath)
      .then((imgs) => {
        if (!cancelled) setPages(imgs);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [pdfPath]);

  if (failed) {
    return (
      <div className={isDark ? styles.fallbackDark : styles.fallbackLight}>
        {/* <p className={styles.fallbackNote}>
          ブラウザ内プレビューを表示できませんでした。下の「PDF
          をダウンロード」、または組み込みビューをご利用ください。
        </p> */}
        <iframe title={docTitle} src={src} className={styles.pdfFrame} />
      </div>
    );
  }

  if (!pages?.length) {
    return (
      <div
        className={isDark ? styles.loadingDark : styles.loadingLight}
        aria-busy="true"
        aria-label="プレビューを準備しています"
      >
        <span className={styles.loadingSpinner} aria-hidden />
      </div>
    );
  }

  return (
    <div className={styles.pageStack}>
      {pages.map((href, i) => (
        <img
          key={`${pdfPath}-p${i}`}
          src={href}
          alt={`${docTitle} — ${i + 1} / ${pages.length}`}
          className={styles.pageImg}
          loading={i < 2 ? "eager" : "lazy"}
        />
      ))}
    </div>
  );
}
