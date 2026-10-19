"use client";

import { useEffect, useState } from "react";
import { browserPublicUrl } from "@/utils/publicPath";
import { configurePdfjsWorker } from "@/utils/configurePdfjsWorker";
import { pdfjsDocumentOptions } from "@/utils/pdfjsDocumentOptions";
import styles from "./PdfMarqueeThumb.module.scss";

/** 先頭ページをレスタライズする幅（CSS px）。キャッシュキーは PDF パスのみ */
const RASTER_WIDTH_CSS_PX = 224;

/** `public/` のルート相対パスをキーにキャッシュ */
const dataUrlCache = new Map<string, string>();
const inflightRaster = new Map<string, Promise<string>>();

type PdfMarqueeThumbProps = {
  /** `public/` からのパス（先頭 `/`。日本語・スペース含み可） */
  pdfPath: string;
  className?: string;
};

async function rasterizeFirstPage(pdfPath: string): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  await configurePdfjsWorker(pdfjs);

  const res = await fetch(browserPublicUrl(pdfPath));
  if (!res.ok) {
    throw new Error(`pdf fetch ${res.status}`);
  }
  const data = new Uint8Array(await res.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data, ...pdfjsDocumentOptions() }).promise;

  try {
    const page = await pdf.getPage(1);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("no canvas context");
    }

    const shellW = RASTER_WIDTH_CSS_PX;
    const baseVp = page.getViewport({ scale: 1 });
    const scale = shellW / baseVp.width;
    const viewport = page.getViewport({ scale });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const renderTask = page.render({
      canvasContext: ctx,
      viewport,
    });
    await renderTask.promise;

    return canvas.toDataURL("image/jpeg", 0.84);
  } finally {
    await pdf.cleanup();
  }
}

function getJpegDataUrl(pdfPath: string): Promise<string> {
  const hit = dataUrlCache.get(pdfPath);
  if (hit) return Promise.resolve(hit);

  let job = inflightRaster.get(pdfPath);
  if (!job) {
    job = rasterizeFirstPage(pdfPath)
      .then((jpeg) => {
        dataUrlCache.set(pdfPath, jpeg);
        return jpeg;
      })
      .finally(() => {
        inflightRaster.delete(pdfPath);
      });
    inflightRaster.set(pdfPath, job);
  }
  return job;
}

export default function PdfMarqueeThumb({
  pdfPath,
  className,
}: PdfMarqueeThumbProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(() =>
    dataUrlCache.get(pdfPath) ?? null,
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const cached = dataUrlCache.get(pdfPath);
    if (cached) {
      setDataUrl(cached);
      return;
    }
    if (!pdfPath) return;

    let cancelled = false;
    void getJpegDataUrl(pdfPath)
      .then((jpeg) => {
        if (!cancelled) setDataUrl(jpeg);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [pdfPath]);

  return (
    <div className={[styles.wrap, className ?? ""].join(" ").trim()}>
      {dataUrl ? (
        <img
          src={dataUrl}
          alt=""
          className={styles.img}
          draggable={false}
        />
      ) : failed ? (
        <span className={styles.fallback}>PDF</span>
      ) : (
        <span className={styles.skeleton} aria-hidden />
      )}
    </div>
  );
}
