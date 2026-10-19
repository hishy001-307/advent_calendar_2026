"use client";

import dynamic from "next/dynamic";

const PosterPdfJsViewer = dynamic(() => import("./PosterPdfJsViewer"), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-[40vh] items-center justify-center py-10"
      aria-busy="true"
      aria-label="プレビューを準備しています"
    >
      <span
        className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent opacity-60 dark:border-white/50 dark:border-t-transparent"
        aria-hidden
      />
    </div>
  ),
});

type Props = {
  pdfPath: string;
  isDark: boolean;
  docTitle: string;
};

export default function PosterPdfClientShell({
  pdfPath,
  isDark,
  docTitle,
}: Props) {
  return (
    <PosterPdfJsViewer pdfPath={pdfPath} isDark={isDark} docTitle={docTitle} />
  );
}
