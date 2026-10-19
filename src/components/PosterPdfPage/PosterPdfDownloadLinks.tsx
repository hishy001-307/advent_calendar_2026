"use client";

import { browserPublicUrl } from "@/utils/publicPath";
import styles from "./PosterPdfPage.module.scss";

type PosterPdfDownloadLinksProps = {
  pdfPaths: string[];
  isDark: boolean;
};

export default function PosterPdfDownloadLinks({
  pdfPaths,
  isDark,
}: PosterPdfDownloadLinksProps) {
  return (
    <div className={styles.downloadRow}>
      {pdfPaths.map((rel, idx) => (
        <a
          key={`dl-${rel}`}
          href={browserPublicUrl(rel)}
          download
          className={
            isDark ? styles.downloadLinkDark : styles.downloadLinkLight
          }
        >
          {pdfPaths.length > 1
            ? `PDF をダウンロード（パート ${idx + 1}）`
            : "PDF をダウンロード"}
        </a>
      ))}
    </div>
  );
}
