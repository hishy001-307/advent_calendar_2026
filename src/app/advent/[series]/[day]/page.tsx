import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { CSSProperties } from 'react';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import { ADVENT_ENTRIES } from '@/data/adventEntries';
import { browserPublicUrl } from '@/utils/publicPath';

type RouteParams = { series: string; day: string };
type PageProps = { params: Promise<RouteParams> };

const SERIES_LABELS: Record<string, string> = {
  series1: 'シリーズ1',
  series2: 'シリーズ2',
};

function parseEntryHref(href: string): RouteParams {
  const match = href.match(/^\/advent\/(series\d+)\/(\d+)$/);
  if (!match) throw new Error(`Invalid Advent Calendar route: ${href}`);
  return { series: match[1], day: match[2] };
}

const entriesByRoute = new Map(
  ADVENT_ENTRIES.map((entry) => {
    const { series, day } = parseEntryHref(entry.href);
    return [`${series}/${day}`, entry] as const;
  }),
);

function parseMdxStyle(style: unknown): CSSProperties | undefined {
  if (typeof style !== 'string') return style as CSSProperties | undefined;
  const declarations = style
    .split(';')
    .map((declaration) => declaration.split(':'))
    .filter(([property, value]) => property?.trim() && value?.trim());
  return Object.fromEntries(
    declarations.map(([property, ...values]) => [
      property
        .trim()
        .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()),
      values.join(':').trim(),
    ]),
  ) as CSSProperties;
}

type HastNode = {
  children?: HastNode[];
  properties?: Record<string, unknown>;
};

type MdastNode = {
  children?: MdastNode[];
  data?: { hProperties?: Record<string, unknown>; [key: string]: unknown };
  type: string;
  value?: string;
};

function rehypeInlineStyles() {
  return (tree: HastNode) => {
    const visit = (node: HastNode) => {
      if (typeof node.properties?.style === 'string') {
        node.properties.style = parseMdxStyle(node.properties.style);
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

function mdxClassesForInlineStyle(style: string) {
  const declarations = style
    .split(';')
    .map((declaration) => declaration.split(':'))
    .filter(([property, value]) => property?.trim() && value?.trim())
    .map(([property, ...values]) => [
      property.trim().toLowerCase(),
      values.join(':').trim().toLowerCase(),
    ]);
  const classes = new Set<string>();

  for (const [property, value] of declarations) {
    if (property === 'text-align' && value === 'center')
      classes.add('text-center');
    if (property === 'font-size') {
      if (value === 'small') classes.add('text-sm');
      if (value === 'large') classes.add('text-lg');
      if (value === 'larger') classes.add('text-xl');
      if (value === 'x-large') classes.add('text-2xl');
    }
    if (property === 'color' && (value === '#666' || value === '#666666')) {
      classes.add('text-zinc-600');
    }
    if (property === 'margin-top' && value === '-1rem') classes.add('-mt-4');
  }

  const className = [...classes].join(' ');
  return className ? ` className="${className}"` : '';
}

function slugifyHeading(text: string) {
  return text
    .normalize('NFKC')
    .toLocaleLowerCase('ja')
    .trim()
    .replace(/[^\p{L}\p{N}_-]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function plainTextFromMdast(node: MdastNode): string {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value ?? '';
  return node.children?.map(plainTextFromMdast).join('') ?? '';
}

function remarkHeadingIds(explicitAnchors: Map<string, string>) {
  return (tree: MdastNode) => {
    const used = new Map<string, number>();
    const visit = (node: MdastNode) => {
      if (node.type === 'heading') {
        const base = slugifyHeading(plainTextFromMdast(node)) || 'section';
        const count = used.get(base) ?? 0;
        used.set(base, count + 1);
        const id = explicitAnchors.get(base) ?? (count ? `${base}-${count + 1}` : base);
        node.data = {
          ...node.data,
          hProperties: { ...node.data?.hProperties, id },
        };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

function normalizeWikiReferences(source: string, anchors: Set<string>) {
  const labels: Record<string, string> = {
    'cite:1': '※1',
    'cite:2': '※2',
    HGP_original: 'HGP符号の原論文',
    Kovalev: 'Kovalevらの研究',
    review_qldpc: 'qLDPC符号のレビュー',
    reshape: 'reshape',
    partitioning: 'partitioning',
    chgp: '巡回HGP符号の研究',
    exp_4d_surface: '高次元表面符号の例',
    extend_lie: 'Lie代数の拡大',
    hikita: 'Hikitaらの研究',
    kawakami: 'Kawakamiらの研究',
    Calabi: 'Calabi–Yau多様体',
    RR: '参考文献（RR）',
    坂本QFT: '坂本の場の量子論',
    JJ: 'J. J. Sakuraiの教科書',
    KMS1: '参考文献1',
    KMS2: '参考文献2',
    scale: 'スケール因子',
    tmn: '時刻とスケール因子',
    ene: 'エネルギー密度',
    para: '宇宙論パラメータ',
    eineq: 'アインシュタイン方程式',
    friedman: 'フリードマン方程式',
    acce: '加速膨張',
  };
  const externalTargets: Record<string, string> = {
    HGP_original: 'https://doi.org/10.1109/TIT.2013.2292061',
    Kovalev: 'https://doi.org/10.1109/ISIT.2012.6284206',
    review_qldpc: 'https://doi.org/10.1103/PRXQuantum.2.040101',
    reshape: 'https://arxiv.org/abs/2105.02370',
    partitioning: 'https://arxiv.org/abs/2105.02370',
    exp_4d_surface: 'https://doi.org/10.1103/PhysRevA.110.062413',
    Calabi: 'https://www.tanaakk.com/2025/03/17/calabiyau-manifold/',
    RR: 'https://userswww.pd.infn.it/~feruglio/rattazzi.pdf',
    KMS1: 'https://doi.org/10.1007/BF01646342',
    KMS2: 'https://doi.org/10.1007/BF01614224',
    'cite:1': 'https://www.asakura.co.jp/detail.php?book_code=13672',
    'cite:2': 'https://www.asakura.co.jp/detail.php?book_code=13633',
  };

  const transformOutsideMath = (part: string) =>
    part.replace(/\[\[([^\]]+)\]\]/g, (_match, token: string, offset: number, whole: string) => {
      if (token === 'n,k' || /^\s*n\s*=/.test(token)) return `[[${token}]]`;
      const label = labels[token] ?? token.replace(/[_-]+/g, ' ');
      const prefix = offset > 0 && !/[\s(\[\{（「『]/.test(whole[offset - 1]) ? ' ' : '';
      if (externalTargets[token]) return `${prefix}[${label}](${externalTargets[token]})`;
      if (anchors.has(token)) return `${prefix}[${label}](#${token})`;
      return `${prefix}${label}`;
    });

  return source
    .split(/(```[\s\S]*?```|~~~[\s\S]*?~~~)/g)
    .map((part) => {
      if (/^(?:```|~~~)/.test(part)) return part;
      return part
        .split(/(\$\$[\s\S]*?\$\$|\$(?:\\.|[^$])+\$)/g)
        .map((segment, index) => (index % 2 ? segment : transformOutsideMath(segment)))
        .join('');
    })
    .join('');
}

function normalizeArticleMarkdown(
  body: string,
  series: string,
  day: string,
  assets: string[],
): { source: string; explicitAnchors: Map<string, string> } {
  let source = body;
  const explicitAnchors = new Map<string, string>();

  // Match Mathlog upload names to the local article assets whenever the export
  // retained the same filename. Encode local paths so Markdown safely accepts
  // Japanese names, spaces, and parentheses as image destinations.
  for (const name of assets) {
    const localPath = `/advent-assets/${series}/${day}/${name}`;
    const encodedPath = `/advent-assets/${series}/${day}/${encodeURIComponent(name)}`;
    source = source.replaceAll(`/uploads/mathdown/${name}`, localPath);
    source = source.replaceAll(localPath, encodedPath);
    const linkStart = `](${encodedPath}`;
    let searchFrom = 0;
    while (true) {
      const start = source.indexOf(linkStart, searchFrom);
      if (start < 0) break;
      const destinationEnd = source.indexOf(')', start + linkStart.length);
      if (destinationEnd < 0) break;
      const suffix = source.slice(start + linkStart.length, destinationEnd);
      if (/^\s*(?:=\s*\d+)?$/.test(suffix)) {
        source = `${source.slice(0, start)}${linkStart})${source.slice(destinationEnd + 1)}`;
        searchFrom = start + linkStart.length + 1;
      } else {
        searchFrom = destinationEnd + 1;
      }
    }
  }

  const lines = source.split('\n');
  const normalized: string[] = [];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      normalized.push(line);
      continue;
    }
    if (inFence) {
      normalized.push(line);
      continue;
    }

    let current = line.replace(/^( {0,3}#{1,6})(?!#)(?=\S)/, '$1 ');
    if (/^\s*\[\^\d+\]:\s*$/.test(current)) continue;
    if (/^\s*&&&\s*$/.test(current)) continue;
    const specialBlock = current.match(/^\s*&&&\s*(def|thm|prop|rem|prf|axm|cor|lem)\b\s*(.*)$/i);
    if (specialBlock) {
      const terms: Record<string, string> = {
        def: '定義', thm: '定理', prop: '命題', rem: '補足',
        prf: '証明', axm: '公理', cor: '系', lem: '補題',
      };
      const title = specialBlock[2].trim();
      current = `#### ${terms[specialBlock[1].toLowerCase()] ?? '注'}${title ? `：${title}` : ''}`;
    } else {
      const titledBlock = current.match(/^\s*&&&\s+(.+)$/);
      if (titledBlock) current = `#### ${titledBlock[1]}`;
    }
    const explicitAnchor = current.match(/^(\s{0,3}#{1,6}\s+)(.+?)\s+\[([A-Za-z][\w:-]*)\]\s*$/);
    if (explicitAnchor) {
      current = `${explicitAnchor[1]}${explicitAnchor[2]}`;
      explicitAnchors.set(slugifyHeading(explicitAnchor[2]), explicitAnchor[3]);
    }

    // Bare links are common in imported references and social-account sections.
    if (!current.includes('](') && !current.includes('<https://') && !current.includes('<http://')) {
      current = current.replace(/(?<![<(])https?:\/\/[^\s<>]+/g, (url) => {
        const suffix = url.match(/[。、，,.;!?:）]+$/)?.[0] ?? '';
        const destination = suffix ? url.slice(0, -suffix.length) : url;
        return `[${destination}](${destination})${suffix}`;
      });
    }
    normalized.push(current);
  }

  const anchors = new Set(explicitAnchors.values());
  return {
    source: normalizeWikiReferences(normalized.join('\n'), anchors),
    explicitAnchors,
  };
}

function removeDuplicateArticleHeading(source: string, title: string) {
  const lines = source.split('\n');
  const first = lines.findIndex((line) => line.trim());
  if (first < 0 || !/^#\s+/.test(lines[first])) return source;
  const heading = lines[first].replace(/^#{1,6}\s+/, '').trim();
  const compact = (value: string) => value.normalize('NFKC').replace(/[\s【】「」『』]/g, '');
  if (compact(heading) !== compact(title)) return source;
  lines.splice(first, 1);
  return lines.join('\n').replace(/^\n+/, '');
}

function getEntry({ series, day }: RouteParams) {
  if (!SERIES_LABELS[series] || !/^\d+$/.test(day)) return undefined;
  return entriesByRoute.get(`${series}/${day}`);
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ADVENT_ENTRIES.map((entry) => parseEntryHref(entry.href));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const route = await params;
  const entry = getEntry(route);
  if (!entry) return { title: '記事が見つかりません | Physics Lab. 2026' };
  return {
    title: `${entry.label} | Physics Lab. 2026 Advent Calendar`,
    description: entry.abstract,
  };
}

const mdxComponents = {
  a: ({ href, children }: React.ComponentProps<'a'>) => {
    const external = Boolean(href && /^https?:\/\//i.test(href));
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt }: React.ComponentProps<'img'>) => {
    if (typeof src !== 'string' || !src) return null;
    let imagePath = src;
    if (src.startsWith('/')) {
      try {
        imagePath = decodeURIComponent(src);
      } catch {
        imagePath = src;
      }
    }
    const imageSrc = imagePath.startsWith('/') ? browserPublicUrl(imagePath) : imagePath;
    return (
      <img
        src={imageSrc}
        alt={alt ?? ''}
        loading="lazy"
        className="mx-auto my-6 max-h-[38rem] max-w-full rounded-lg border border-zinc-200 object-contain"
      />
    );
  },
};

async function readArticleBody(series: string, day: string) {
  const filePath = path.join(
    process.cwd(),
    'src',
    'content',
    'advent',
    'articles',
    series,
    `${day}.mdx`,
  );
  try {
    return await readFile(filePath, 'utf8');
  } catch {
    return '';
  }
}

async function readArticleAssets(series: string, day: string) {
  const folder = path.join(
    process.cwd(),
    'public',
    'advent-assets',
    series,
    day,
  );
  try {
    const names = await readdir(folder);
    return names
      .filter((name) => /\.(png|jpe?g|webp|gif)$/i.test(name))
      .sort((a, b) => a.localeCompare(b, 'ja'));
  } catch {
    return [];
  }
}

type BalancedGroup = { value: string; end: number };

function readBalancedGroup(
  source: string,
  start: number,
  open: string,
  close: string,
): BalancedGroup | undefined {
  if (source[start] !== open) return undefined;
  let depth = 0;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (character === '\\') {
      index += 1;
      continue;
    }
    if (character === open) depth += 1;
    if (character === close) {
      depth -= 1;
      if (depth === 0) {
        return { value: source.slice(start + 1, index), end: index + 1 };
      }
    }
  }

  return undefined;
}

function skipWhitespace(source: string, start: number) {
  let index = start;
  while (/\s/.test(source[index] ?? '')) index += 1;
  return index;
}

function replaceTexInvocation(
  source: string,
  command: string,
  transform: (source: string, argumentStart: number) =>
    | { end: number; replacement: string }
    | undefined,
) {
  const token = '\\' + command;
  let result = '';
  let index = 0;

  while (index < source.length) {
    if (source[index] === '\\' && source[index + 1] === '\\') {
      result += '\\\\';
      index += 2;
      continue;
    }

    const afterToken = index + token.length;
    if (
      source.startsWith(token, index) &&
      !/[A-Za-z]/.test(source[afterToken] ?? '')
    ) {
      const transformed = transform(source, afterToken);
      if (transformed) {
        result += transformed.replacement;
        index = transformed.end;
        continue;
      }
    }

    result += source[index];
    index += 1;
  }

  return result;
}

function replaceTexGroupCommand(
  source: string,
  command: string,
  transform: (groups: string[]) => string,
  argumentCount: number,
) {
  return replaceTexInvocation(source, command, (input, argumentStart) => {
    const groups: string[] = [];
    let index = argumentStart;

    for (let groupIndex = 0; groupIndex < argumentCount; groupIndex += 1) {
      index = skipWhitespace(input, index);
      const group = readBalancedGroup(input, index, '{', '}');
      if (!group) return undefined;
      groups.push(group.value);
      index = group.end;
    }

    return { end: index, replacement: transform(groups) };
  });
}

function normalizeDisplayMathWhitespace(source: string) {
  const input = source.split('\n');
  const output: string[] = [];
  let inMath = false;
  let mathBodyStart = -1;

  const openMath = () => {
    if (output.length && output[output.length - 1].trim()) output.push('');
    output.push('$$');
    inMath = true;
    mathBodyStart = output.length;
  };

  const closeMath = () => {
    while (output.length > mathBodyStart && !output[output.length - 1].trim()) {
      output.pop();
    }
    while (
      mathBodyStart < output.length &&
      !output[mathBodyStart].trim()
    ) {
      output.splice(mathBodyStart, 1);
    }

    const math = output.slice(mathBodyStart).join('\n');
    const proseWithoutTextCommands = math.replace(/\\text\s*\{[^{}]*\}/g, '');
    const hasJapaneseProse =
      /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(
        proseWithoutTextCommands,
      );
    if (
      math &&
      /(?<!\\)&/.test(math) &&
      !hasJapaneseProse &&
      !/\\begin\{(?:aligned|align\*?|eqnarray\*?)\}/.test(math)
    ) {
      output.splice(
        mathBodyStart,
        output.length - mathBodyStart,
        '\\begin{aligned}',
        math,
        '\\end{aligned}',
      );
    }

    output.push('$$');
    inMath = false;
    mathBodyStart = -1;
  };

  for (let index = 0; index < input.length; index += 1) {
    const line = input[index];
    const beginsDisplayMath = line.match(/^[ \t]*\$\$/);
    const displayMathCount = (line.match(/(?<!\\)\$\$/g) ?? []).length;
    const endsDisplayMath = /(?<!\\)\$\$[ \t]*$/.test(line);

    if (line.trim() === '$$') {
      let nextMarker = index + 1;
      while (nextMarker < input.length && !input[nextMarker].trim()) {
        nextMarker += 1;
      }
      if (!inMath && input[nextMarker]?.trim() === '$$') {
        index = nextMarker;
        continue;
      }

      if (inMath) {
        closeMath();
      } else {
        openMath();
        while (input[index + 1] !== undefined && !input[index + 1].trim()) {
          index += 1;
        }
      }
      continue;
    }

    if (!inMath && beginsDisplayMath && displayMathCount === 2 && endsDisplayMath) {
      openMath();
      const body = line
        .slice(beginsDisplayMath[0].length)
        .replace(/(?<!\\)\$\$[ \t]*$/, '')
        .replace(/[ \t]+$/, '');
      if (body.trim()) output.push(body.trimStart());
      closeMath();
      if (input[index + 1]?.trim()) output.push('');
      continue;
    }

    if (!inMath && beginsDisplayMath && displayMathCount === 1) {
      openMath();
      const body = line.slice(beginsDisplayMath[0].length);
      if (body.trim()) output.push(body.trimStart());
      continue;
    }

    if (inMath && displayMathCount === 1 && endsDisplayMath) {
      const body = line
        .replace(/(?<!\\)\$\$[ \t]*$/, '')
        .replace(/[ \t]+$/, '');
      if (body.trim()) output.push(body);
      closeMath();
      if (input[index + 1]?.trim()) output.push('');
      continue;
    }

    if (!inMath && line.trim() && output[output.length - 1]?.trim() === '$$') {
      output.push('');
    }
    output.push(line);
  }

  return output.join('\n');
}

function normalizeLatexSource(source: string) {
  return source
    .split(/(\x60{3}[\s\S]*?\x60{3}|~~~[\s\S]*?~~~)/g)
    .map((part) => {
      if (/^(?:\x60{3}|~~~)/.test(part)) return part;

      let normalized = part
        .replace(/\\TextCenter/g, '')
        .replace(/\\label\s*\{[^{}]*\}/g, '')
        .replace(
          /\\begin\{eqnarray\*?\}([\s\S]*?)\\end\{eqnarray\*?\}/g,
          (_match, math: string, offset: number, whole: string) => {
            const aligned = '\\begin{aligned}' + math + '\\end{aligned}';
            const openDisplayMathCount =
              (whole.slice(0, offset).match(/(?<!\\)\$\$/g) ?? []).length;
            return openDisplayMathCount % 2 === 1
              ? aligned
              : '\n\n$$\n' + aligned + '\n$$\n\n';
          },
        )
        .replace(
          /\\begin\{(equation\*?|align\*?|gather\*?)\}([\s\S]*?)\\end\{\1\}/g,
          (_match, environment: string, math: string) =>
            '\n\n$$\n\\begin{' +
            environment +
            '}' +
            math +
            '\\end{' +
            environment +
            '}\n$$\n\n',
        );

      normalized = replaceTexGroupCommand(
        normalized,
        'enclose',
        ([kind, body]) =>
          kind.trim() === 'horizontalstrike'
            ? '\\cancel{' + body + '}'
            : body,
        2,
      );
      normalized = replaceTexInvocation(normalized, 'pdv', (input, start) => {
        const firstStart = skipWhitespace(input, start);
        const first = readBalancedGroup(input, firstStart, '{', '}');
        if (!first) return undefined;
        const secondStart = skipWhitespace(input, first.end);
        const second = readBalancedGroup(input, secondStart, '{', '}');
        if (second) {
          return {
            end: second.end,
            replacement:
              '\\frac{\\partial' +
              (first.value.trim() ? ' ' + first.value : '') +
              '}{\\partial ' +
              second.value +
              '}',
          };
        }
        return {
          end: first.end,
          replacement: '\\frac{\\partial}{\\partial ' + first.value + '}',
        };
      });
      normalized = replaceTexInvocation(normalized, 'dv', (input, start) => {
        const firstStart = skipWhitespace(input, start);
        const first = readBalancedGroup(input, firstStart, '{', '}');
        if (!first) return undefined;
        const secondStart = skipWhitespace(input, first.end);
        const second = readBalancedGroup(input, secondStart, '{', '}');
        if (!second) return undefined;
        return {
          end: second.end,
          replacement:
            '\\frac{\\mathrm{d}' +
            (first.value.trim() ? ' ' + first.value : '') +
            '}{\\mathrm{d} ' +
            second.value +
            '}',
        };
      });
      normalized = replaceTexGroupCommand(
        normalized,
        'ev',
        ([operator, state]) =>
          '\\left\\langle ' +
          state +
          ' \\middle| ' +
          operator +
          ' \\middle| ' +
          state +
          ' \\right\\rangle',
        2,
      );
      normalized = replaceTexGroupCommand(
        normalized,
        'vb',
        ([vector]) => '{\\boldsymbol{' + vector + '}}',
        1,
      );
      normalized = replaceTexInvocation(normalized, 'vb', (input, start) => {
        if (input[start] !== '*') return undefined;
        const groupStart = skipWhitespace(input, start + 1);
        const group = readBalancedGroup(input, groupStart, '{', '}');
        if (group) {
          return {
            end: group.end,
            replacement: '{\\boldsymbol{' + group.value + '}}',
          };
        }
        const next = input[groupStart];
        if (!next || /[\s_^\]}]/.test(next)) return undefined;
        const tokenEnd =
          next === '\\'
            ? (input.slice(groupStart + 1).match(/^[A-Za-z]+/)?.[0].length ?? 0) +
              groupStart +
              1
            : groupStart + 1;
        if (tokenEnd === groupStart + 1 && next === '\\') return undefined;
        return {
          end: tokenEnd,
          replacement:
            '{\\boldsymbol{' + input.slice(groupStart, tokenEnd) + '}}',
        };
      });
      normalized = replaceTexInvocation(normalized, 'qty', (input, start) => {
        const groupStart = skipWhitespace(input, start);
        const open = input[groupStart];
        const close =
          open === '{' ? '}' : open === '[' ? ']' : open === '(' ? ')' : '';
        if (!close) return undefined;
        const group = readBalancedGroup(input, groupStart, open, close);
        if (!group) return undefined;
        const left = open === '[' ? '[' : '(';
        const right = open === '[' ? ']' : ')';
        return {
          end: group.end,
          replacement: '\\left' + left + group.value + '\\right' + right,
        };
      });
      normalized = replaceTexInvocation(normalized, 'mqty', (input, start) => {
        const groupStart = skipWhitespace(input, start);
        const group = readBalancedGroup(input, groupStart, '(', ')');
        return group
          ? {
              end: group.end,
              replacement:
                '\\begin{pmatrix}' + group.value + '\\end{pmatrix}',
            }
          : undefined;
      });

      normalized = normalizeDisplayMathWhitespace(normalized);
      const lines = normalized.split('\n');
      for (let index = 1; index < lines.length - 1; index += 1) {
        if (
          !lines[index].trim() &&
          /^\s*\|.*\|\s*$/.test(lines[index - 1]) &&
          /^\s*\|.*\|\s*$/.test(lines[index + 1])
        ) {
          lines.splice(index, 1);
          index -= 1;
        }
      }

      normalized = lines.join('\n');

      return normalized;
    })
    .join('');
}

function escapeMdxBraces(source: string) {
  source = normalizeLatexSource(source);
  source = source
    .replace(
      /(?<!\\)\\\[([\s\S]*?)(?<!\\)\\\]/g,
      (_, math: string) => `\n$$\n${math}\n$$\n`,
    )
    .replace(/\\begin\{eqnarray\*?\}/g, '\n$$\n\\begin{aligned}')
    .replace(/\\end\{eqnarray\*?\}/g, '\\end{aligned}\n$$\n')
    .replace(/^\\newcommand\{\\df\}\[1\]\{.*\}$/gm, '')
    .replace(/^\\newcommand\{\\dff\}\[1\]\{.*\}$/gm, '')
    .replace(/\u200b/g, '')
    .replace(/\u00a0/g, ' ')
    .replace(/<br\s*\/?\s*>/gi, '<br />')
    .replace(/<hr\s*\/?\s*>/gi, '<hr />')
    .replace(/\sstyle=(["'])(.*?)\1/gi, (_, _quote, style: string) =>
      mdxClassesForInlineStyle(style),
    )
    .split('\n')
    .map((line) => {
      const delimiters = line.match(/\$\$/g)?.length ?? 0;
      const trimmed = line.trim();
      if (
        delimiters === 2 &&
        trimmed.startsWith('$$') &&
        trimmed.endsWith('$$')
      ) {
        return line;
      }
      return line.replace(
        /\$\$([^$\n]+?)\$\$/g,
        (_, math: string) => `$${math}$`,
      );
    })
    .join('\n');
  const lines: string[] = [];
  let inFence = false;
  let inMathBlock = false;

  for (const line of source.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      lines.push(line);
      continue;
    }
    if (inFence) {
      lines.push(line);
      continue;
    }

    const delimiterCount = (line.match(/\$\$/g) ?? []).length;
    if (!inMathBlock) {
      if (delimiterCount % 2 === 1) {
        inMathBlock = true;
        const openingIndex = line.indexOf('$$');
        const beforeOpening = line.slice(0, openingIndex);
        const afterOpening = line.slice(openingIndex + 2);
        if (!beforeOpening.trim() || /^>\s*$/.test(beforeOpening)) {
          lines.push('$$');
          if (afterOpening.trim()) lines.push(afterOpening.trimStart());
          continue;
        }
      }
      lines.push(line);
      continue;
    }

    if (delimiterCount % 2 === 1) {
      const closingIndex = line.lastIndexOf('$$');
      const beforeClosing = line.slice(0, closingIndex);
      const afterClosing = line.slice(closingIndex + 2);
      if (beforeClosing.trim()) lines.push(beforeClosing);
      lines.push('$$');
      if (afterClosing.trim()) lines.push(afterClosing);
      inMathBlock = false;
      continue;
    }

    lines.push(line);
  }

  let inBraceFence = false;
  let inBraceMathBlock = false;

  return lines
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inBraceFence = !inBraceFence;
        return line;
      }
      if (inBraceFence) return line;

      const delimiterCount = (line.match(/\$\$/g) ?? []).length;
      if (delimiterCount % 2 === 1) {
        inBraceMathBlock = !inBraceMathBlock;
      }
      if (inBraceMathBlock || delimiterCount > 0) return line;

      // MDX treats braces in ordinary prose as JavaScript expressions. Escape only
      // prose braces; code and mathematical expressions above remain unchanged.
      return line
        .split(/(`+.*?`+|\$\$.*?\$\$|\$(?:\\.|[^$])+\$)/g)
        .map((part, index) =>
          index % 2 === 1 ? part : part.replace(/\\?([{}])/g, '\\$1'),
        )
        .join('');
    })
    .join('\n');
}

function formatJapaneseDate(date: string) {
  const [, month, day] = date.match(/^\d{4}-(\d{2})-(\d{2})$/) ?? [];
  return month && day ? `${Number(month)}月${Number(day)}日` : date;
}

export default async function AdventArticlePage({ params }: PageProps) {
  const route = await params;
  const entry = getEntry(route);
  if (!entry) notFound();

  const [body, assets] = await Promise.all([
    readArticleBody(route.series, route.day),
    readArticleAssets(route.series, route.day),
  ]);
  const normalizedArticle = normalizeArticleMarkdown(
    body,
    route.series,
    route.day,
    assets,
  );
  const normalizedBody = removeDuplicateArticleHeading(
    normalizedArticle.source,
    entry.label,
  );
  const renderableBody = escapeMdxBraces(normalizedBody);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/advent"
            prefetch={false}
            className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-950 hover:underline"
          >
            ← カレンダーに戻る
          </Link>
          {entry.externalLink ? (
            <a
              href={entry.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-950 hover:underline"
            >
              投稿元の記事を開く ↗
            </a>
          ) : null}
        </div>

        <article className="rounded-2xl border border-[#e7e0cb] bg-white px-5 py-7 shadow-sm sm:px-10 sm:py-10">
          <header className="mb-8 border-b border-zinc-200 pb-6">
            <p className="mb-2 text-sm font-medium tracking-wide text-zinc-500">
              Physics Lab. 2026 Advent Calendar · {SERIES_LABELS[route.series]}{' '}
              · {formatJapaneseDate(entry.date)}
            </p>
            <h1 className="text-balance text-2xl font-bold leading-tight text-[#444443] sm:text-4xl">
              {entry.label}
            </h1>
            {entry.author ? (
              <p className="mt-3 text-sm text-zinc-600">著者：{entry.author}</p>
            ) : null}
          </header>

          {body ? (
            <div className="prose max-w-none break-words text-zinc-800 [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-600 [&_hr]:my-8 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto">
              <MDXRemote
                source={renderableBody}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [
                      remarkGfm,
                      remarkMath,
                      () => remarkHeadingIds(normalizedArticle.explicitAnchors),
                    ],
                    rehypePlugins: [
                      [
                        rehypeKatex,
                        {
                          throwOnError: false,
                          macros: {
                            '\\Tr': '\\operatorname{Tr}',
                            '\\dd': '\\mathrm{d}',
                            '\\df': '\\frac{\\partial}{\\partial #1}',
                            '\\dff': '\\frac{\\partial^2}{\\partial #1^2}',
                            '\\ev': '\\left\\langle #1 \\right\\rangle',
                            '\\qty': '\\left(#1\\right)',
                            '\\abs': '\\left\\lvert #1 \\right\\rvert',
                            '\\cross': '\\times',
                            '\\dyad':
                              '\\left\\lvert #1 \\right\\rangle\\left\\langle #1 \\right\\rvert',
                            '\\h': '\\hat{#1}',
                            '\\k': '\\kappa',
                            '\\mel':
                              '\\left\\langle #1 \\middle| #2 \\middle| #3 \\right\\rangle',
                            '\\order': '\\mathcal{O}\\left(#1\\right)',
                            '\\par': '\\partial',
                            '\\w': '\\omega',
                          },
                        },
                      ],
                      rehypeInlineStyles,
                    ],
                  },
                }}
              />
            </div>
          ) : (
            <section className="rounded-xl bg-[#f7f5ee] p-5 text-zinc-700">
              <p className="leading-relaxed">
                {entry.abstract ?? 'この記事の概要はまだありません。'}
              </p>
              {entry.externalLink ? (
                <p className="mt-4 text-sm">
                  本文は投稿元で公開されています。上の「投稿元の記事を開く」から読めます。
                </p>
              ) : null}
            </section>
          )}

        </article>
      </main>
      <Footer />
    </>
  );
}
