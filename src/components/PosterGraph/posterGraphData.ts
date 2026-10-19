/**
 * CSV (`/poster_tags_export.csv`) を読んで、ポスター情報・エッジ・配色を生成するユーティリティ。
 * クライアント側で `fetch` した CSV テキストを `parsePostersCsv` に渡して使う。
 */

export type Difficulty = 1 | 2 | 3;

export type Poster = {
  id: number;
  title: string;
  author: string;
  url: string;
  difficulty: Difficulty;
  /** 班名（例：素粒子物理班） */
  team: string;
  /** サブタグ（例：QFT, 量子多体系） */
  subtag: string;
  /** 関連ポスターのタイトル一覧（CSV原文ママ） */
  related: string[];
};

export type GraphEdge = {
  source: number;
  target: number;
  /** 0..1 の重み。1.0 が「明示的な関連ポスター」、それ以外は同じサブタグなどによる弱い結合 */
  strength: number;
};

/**
 * 班ごとの基本色（RGB）。`/public` の各班ロゴから抽出した代表色。
 * 難易度が高くなるほど濃く描画する。
 */
export const TEAM_BASE_COLOR: Record<string, [number, number, number]> = {
  素粒子物理班: [126, 84, 156], // particle.png : 紫
  物性物理班: [196, 162, 84], // solid.png : 山吹色（ハチの巣模様の黄系）
  宇宙物理班: [42, 122, 122], // space.png : 深い青緑
  "計算・数理物理班": [86, 161, 207], // calc.png : 水色
  生物物理班: [122, 175, 102], // bio.png : 葉緑色
  実験班: [177, 75, 75], // exp.png : ニュートンの揺りかご・煉瓦色
  サッカー班: [128, 128, 128], // フォールバック
};

export const FALLBACK_COLOR: [number, number, number] = [120, 120, 120];

/** 班名 → 基本RGB を取得。未登録班はフォールバック色。 */
export function teamBaseColor(team: string): [number, number, number] {
  return TEAM_BASE_COLOR[team] ?? FALLBACK_COLOR;
}

/**
 * 班 + 難易度から RGB 色を返す。難易度 1 = パステル、2 = ベース、3 = 濃色。
 */
export function colorForPoster(team: string, difficulty: Difficulty): string {
  const base = teamBaseColor(team);
  const [r, g, b] = base;
  if (difficulty === 1) {
    const t = 0.55;
    return `rgb(${mix(r, 255, t)}, ${mix(g, 255, t)}, ${mix(b, 255, t)})`;
  }
  if (difficulty === 3) {
    const f = 0.55;
    return `rgb(${Math.round(r * f)}, ${Math.round(g * f)}, ${Math.round(b * f)})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

function mix(a: number, b: number, t: number): number {
  return Math.round(a * (1 - t) + b * t);
}

/**
 * 関連ポスター列のタイトルと、ポスター原題の表記揺れを吸収するための正規化。
 * `?`, `:`, `/`, `\` や全角の `？` `：` `／` `＼` などが "_" に揃う前提で、
 * 両側で同じ規則を適用してから比較する。
 */
export function normalizeTitle(t: string): string {
  return t
    .trim()
    .replace(/[?:/\\]/g, "_")
    // 全角の ? ： / ＼ など（Overleaf 由来の表記と CSV の表記揺れ）
    .replace(/[？：／＼]/g, "_")
    .replace(/\s*_\s*/g, "_")
    .replace(/\s+/g, " ");
}

function parseDifficulty(s: string): Difficulty {
  const head = s.trim().charAt(0);
  if (head === "1") return 1;
  if (head === "3") return 3;
  return 2;
}

/**
 * CSV 文字列を `Poster[]` に変換する。
 * - ヘッダ行をスキップ
 * - 区切り文字は ASCII カンマのみ（フィールド内に ASCII カンマは含まれない前提）
 */
export function parsePostersCsv(csv: string): Poster[] {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  const [, ...rows] = lines;
  return rows
    .map((line, idx): Poster | null => {
      const cols = line.split(",");
      if (cols.length < 5) return null;
      while (cols.length < 6) cols.push("");
      const [titleRaw, authorRaw, urlRaw, difficultyRaw, tagsRaw, relatedRaw] =
        cols;
      const title = titleRaw.trim();
      if (!title) return null;
      const tagParts = tagsRaw.split("|").map((s) => s.trim());
      const team = tagParts[0] ?? "";
      const subtag = tagParts[1] ?? "";
      const related = relatedRaw
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);
      return {
        id: idx,
        title,
        author: authorRaw.trim(),
        url: urlRaw.trim(),
        difficulty: parseDifficulty(difficultyRaw),
        team,
        subtag,
        related,
      };
    })
    .filter((p): p is Poster => p !== null);
}

/**
 * `Poster[]` からグラフのエッジを生成する。
 * - 「関連ポスター」列で明示されたペア → 強い結合 (strength 1.0)
 * - 同じ班 & 同じサブタグ → 弱い結合 (strength 0.25)（クラスタリングを助ける）
 */
/** @internal 関連列の表記ゆれ用（posterGraphUrlResolve と同系） */
function looseTitleKey(t: string): string {
  return normalizeTitle(t)
    .replace(/[【】[\]()（）]/g, "")
    .replace(/:/g, "")
    .replace(/-/g, "")
    .replace(/\s+/g, "");
}

export function buildEdges(posters: Poster[]): GraphEdge[] {
  const titleMap = new Map<string, number>();
  const looseMap = new Map<string, number>();
  posters.forEach((p) => {
    titleMap.set(normalizeTitle(p.title), p.id);
    looseMap.set(looseTitleKey(p.title), p.id);
  });

  const edges: GraphEdge[] = [];
  const seen = new Set<string>();

  function addEdge(a: number, b: number, strength: number): void {
    if (a === b) return;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    const existing = seen.has(key);
    if (existing) {
      // 同じペアに複数の根拠がある場合は、強い方を残す
      const idx = edges.findIndex(
        (e) =>
          (e.source === a && e.target === b) ||
          (e.source === b && e.target === a),
      );
      if (idx >= 0 && edges[idx].strength < strength) {
        edges[idx].strength = strength;
      }
      return;
    }
    seen.add(key);
    edges.push({ source: a, target: b, strength });
  }

  posters.forEach((p) => {
    p.related.forEach((rel) => {
      const id =
        titleMap.get(normalizeTitle(rel)) ?? looseMap.get(looseTitleKey(rel));
      if (id !== undefined) addEdge(p.id, id, 1.0);
    });
  });

  for (let i = 0; i < posters.length; i++) {
    for (let j = i + 1; j < posters.length; j++) {
      const pi = posters[i];
      const pj = posters[j];
      if (pi.team && pi.team === pj.team && pi.subtag && pi.subtag === pj.subtag) {
        addEdge(pi.id, pj.id, 0.25);
      }
    }
  }

  return edges;
}

/**
 * 凡例表示用：班一覧（CSV の出現順を保ちつつ重複排除）と各班のベース色。
 */
export function teamLegend(posters: Poster[]): {
  team: string;
  color: string;
}[] {
  const seen = new Set<string>();
  const legend: { team: string; color: string }[] = [];
  posters.forEach((p) => {
    if (!p.team || seen.has(p.team)) return;
    seen.add(p.team);
    legend.push({ team: p.team, color: colorForPoster(p.team, 2) });
  });
  return legend;
}
