import katex from "katex";
import type { ReactNode } from "react";

/** 文中の `$...$` を KaTeX でレンダリングし、フラグメント列に変換。（表示数式のみ想定／本文はサイト運営者編集前提） */
export function fragmentsWithInlineMath(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\$([^$\n]+?)\$/gu;
  let last = 0;
  let m: RegExpExecArray | null;
  let ki = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(text.slice(last, m.index));
    }

    const raw = (m[1] ?? "").trim();
    try {
      const html = katex.renderToString(raw, {
        output: "html",
        throwOnError: false,
        displayMode: false,
      });
      parts.push(
        // eslint-disable-next-line react/no-danger -- KaTeX 出力をインライン数式として表示
        <span key={`imat-${ki++}`} dangerouslySetInnerHTML={{ __html: html }} />
      );
    } catch {
      parts.push(`$${raw}$`);
    }

    last = m.index + m[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts.length > 0 ? parts : [text];
}
