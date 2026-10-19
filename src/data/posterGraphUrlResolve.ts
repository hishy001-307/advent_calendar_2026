import { COMPLETED_SLIDES } from "@/data/completedSlides.gen";
import { FINISHED_POSTERS, type TeamSlug } from "@/data/finishedPosters";

/** CSV の `tags` 先頭（班ラベル）→ サイトの team スラッグ */
export const POSTER_GRAPH_CSV_TEAM_TO_SLUG: Record<string, TeamSlug> = {
  素粒子物理班: "particle",
  物性物理班: "condensed-matter",
  宇宙物理班: "astrophysics",
  "計算・数理物理班": "computational-math",
  生物物理班: "biophysics",
  実験班: "experimental",
  /** CSV 上の分類。該当 PDF は `public/biophysics` に配置 */
  サッカー班: "biophysics",
};

export function graphTitleMatchKey(title: string): string {
  return title
    .normalize("NFKC")
    .replace(/\\/g, "")
    .replace(/\$/g, "")
    .replace(/\^/g, "")
    .replace(/_/g, "")
    .replace(/[〜～]/g, "〜")
    .replace(/[－﹣−—–]/g, "-")
    .replace(/[：﹕]/g, ":")
    .replace(/[／]/g, "/")
    .replace(/[？?！!]/g, "")
    .replace(/[「」『』]/g, "")
    .replace(/[,，、]/g, "")
    .replace(/[\s\u3000]+/g, "")
    .toLowerCase();
}

/** PDF 表題 ↔ CSV 表題用（括弧・ハイフンを無視して一致率を上げる） */
export function graphTitleLooseKey(title: string): string {
  return graphTitleMatchKey(title)
    .replace(/[【】[\]()（）]/g, "")
    .replace(/:/g, "")
    .replace(/-/g, "");
}

/** コロン前の短文キー（例: CSV「g-2測定：〜」とファイル名「g-2測定」） */
function variantKeys(title: string): string[] {
  const k = graphTitleMatchKey(title);
  const set = new Set<string>([k]);
  const head = k.split(":")[0];
  if (head && head.length >= 2 && head !== k) set.add(head);
  return [...set];
}

function withTrailingSlash(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}

export function titleMatchScore(fullKey: string, sk: string): number {
  if (fullKey === sk) return fullKey.length;
  if (!fullKey || !sk) return 0;
  if (fullKey.startsWith(sk) || sk.startsWith(fullKey)) {
    return Math.min(fullKey.length, sk.length);
  }
  if (fullKey.includes(sk)) return sk.length;
  if (sk.includes(fullKey)) return fullKey.length;
  return 0;
}

const hrefByTeamAndKey = new Map<string, string>();

for (const row of COMPLETED_SLIDES) {
  const href = withTrailingSlash(`/teams/${row.teamSlug}/pdf/${row.slug}`);
  for (const vk of variantKeys(row.title)) {
    hrefByTeamAndKey.set(`${row.teamSlug}\0${vk}`, href);
  }
}

for (const p of FINISHED_POSTERS) {
  const href = withTrailingSlash(`/teams/${p.teamSlug}/pdf/${p.slug}`);
  for (const vk of variantKeys(p.title)) {
    const composite = `${p.teamSlug}\0${vk}`;
    if (!hrefByTeamAndKey.has(composite)) {
      hrefByTeamAndKey.set(composite, href);
    }
  }
}

/** CSV と `public/{teamSlug}` の表題が一致しないときの代表例 */
const GRAPH_CSV_TITLE_ALIASES: Array<{
  team: TeamSlug;
  csvTitle: string;
  slideSlug: string;
}> = [
  {
    team: "astrophysics",
    csvTitle: "一般相対論とシュワルツシルト時空から見る宇宙",
    slideSlug: "一般相対論とシュワルツシルト時空で見る宇宙",
  },
  {
    team: "astrophysics",
    csvTitle: "宇宙の誕生から現在まで",
    slideSlug: "宇宙の誕生から晴れ上がりまで",
  },
  {
    team: "astrophysics",
    csvTitle: "宇宙の時間を巻き戻す方法",
    slideSlug: "宇宙の時間を戻す方法",
  },
  {
    team: "experimental",
    csvTitle: "人流への物理モデルの応用",
    slideSlug: "人の動きを物理で理解しよう",
  },
  {
    team: "experimental",
    csvTitle: "オーロラは実験室上で再現できるのだろうか",
    slideSlug: "オーロラは机の上で再現できるのだろうか",
  },
  {
    team: "computational-math",
    csvTitle: "ベルの不等式概論",
    slideSlug: "量子エンタングルメント-ベルの不等式概論",
  },
  {
    team: "condensed-matter",
    csvTitle: "中性原子量子コンピューターの物理",
    slideSlug: "中性原子量子コンピューターの物理",
  },
  {
    team: "astrophysics",
    csvTitle: "【ダークマター】最強候補Tierリスト【最新版】",
    slideSlug: "ダークマター-最強候補-Tier-リスト-最新版",
  },
  {
    team: "astrophysics",
    csvTitle: "宇宙マイクロ波背景放射(CMB)",
    slideSlug: "宇宙マイクロ波背景放射-CMB",
  },
  {
    team: "astrophysics",
    csvTitle: "活動銀河核AGN  - 統一モデルからLRDまで -",
    slideSlug: "活動銀河核-AGN-統一モデルから-LRD-まで",
  },
  {
    team: "astrophysics",
    csvTitle: "相対論1 特殊相対性理論",
    slideSlug: "相対論1-特殊相対性理論",
  },
  {
    team: "astrophysics",
    csvTitle: "相対論2 一般相対性理論",
    slideSlug: "相対論-2-一般相対性理論",
  },
  {
    team: "astrophysics",
    csvTitle: "電磁流体力学　 〜新しい古典物理〜",
    slideSlug: "電磁流体力学-新しい古典物理",
  },
  {
    team: "particle",
    csvTitle: "QEDからKlein-Nishinaの公式を導く",
    slideSlug: "QED-から-Klein-Nishina-の公式を導く",
  },
  {
    team: "particle",
    csvTitle: "QFTクイズを1問(経路積分と時間発展)",
    slideSlug: "QFT-クイズを-1-問-経路積分と時間発展",
  },
  {
    team: "particle",
    csvTitle: "$B^0$中間子の$CP$対称性を破るメカニズム",
    slideSlug: "B0-中間子の-CP-対称性を破るメカニズム",
  },
  {
    team: "particle",
    csvTitle: "弱い力は向きを選ぶ 〜ヘリシティに焦点を当てて〜",
    slideSlug: "弱い力は向きを選ぶ-ヘリシティに焦点を当てて",
  },
  {
    team: "particle",
    csvTitle: "世界を記述する式：標準模型",
    slideSlug: "世界を記述する式-標準模型",
  },
  {
    team: "particle",
    csvTitle: "一粒子状態とは何か 　〜Wignerの分類〜",
    slideSlug: "一粒子状態とは何か-Wigner-の分類",
  },
  {
    team: "computational-math",
    csvTitle: "AdS/CFT対応とHawking-Page相転移",
    slideSlug: "AdS-CFT-対応と-Hawking-Page-相転移",
  },
  {
    team: "computational-math",
    csvTitle: "AdS\\CFT的幸福術",
    slideSlug: "AdS-CFT的幸福術",
  },
  {
    team: "computational-math",
    csvTitle: "AIでノーベル物理学賞？",
    slideSlug: "AI-でノーベル物理学賞",
  },
  {
    team: "computational-math",
    csvTitle: "Hayden-Preskillプロトコルと量子カオス",
    slideSlug: "Hayden-Preskill-プロトコルと量子カオス",
  },
  {
    team: "computational-math",
    csvTitle: "Shorのアルゴリズム",
    slideSlug: "Shor-のアルゴリズム",
  },
  {
    team: "computational-math",
    csvTitle: "Shorのアルゴリズムの現状",
    slideSlug: "Shor-のアルゴリズムの現状",
  },
  {
    team: "computational-math",
    csvTitle: "---Symplectic多様体について---",
    slideSlug: "Symplectic-多様体について",
  },
  {
    team: "computational-math",
    csvTitle: "Theorema Egregium（すごい定理）",
    slideSlug: "Theorema-Egregium-すごい定理",
  },
  {
    team: "computational-math",
    csvTitle: "位相的場の量子論(TQFT)のすゝめ",
    slideSlug: "位相的場の量子論-TQFT-のすゝめ",
  },
  {
    team: "computational-math",
    csvTitle: "線型演算子(有限と無限)",
    slideSlug: "線型演算子-有限と無限",
  },
  {
    team: "biophysics",
    csvTitle: "Alpha Fold2を理解しよう(1):Self-Attention",
    slideSlug: "AlphaFold2-を理解しよう-1-Self-Attention",
  },
  {
    team: "biophysics",
    csvTitle: "Alpha Fold2を理解しよう(2):共進化と幾何学的拘束",
    slideSlug: "AF2-を理解しよう-2-共進化と幾何学的拘束",
  },
  {
    team: "biophysics",
    csvTitle: "Alpha Fold2を理解しよう(3) :構造予測パート",
    slideSlug: "AF2-を理解しよう-3-構造予測パート",
  },
  {
    team: "biophysics",
    csvTitle: "東大理学部物理学科生はスポーツとかするの？",
    slideSlug: "東大理学部物理学科生はスポーツとかするの",
  },
  {
    team: "biophysics",
    csvTitle: "生物物理学で、どんなことがわかる？",
    slideSlug: "生物物理学で-どんなことがわかる",
  },
  {
    team: "condensed-matter",
    csvTitle: "いろんな方法でものを「見る」",
    slideSlug: "いろんな方法でものを-見る",
  },
  {
    team: "condensed-matter",
    csvTitle: "異常速度：位置演算子は非可換に？",
    slideSlug: "異常速度-位置演算子は非可換に",
  },
  {
    team: "condensed-matter",
    csvTitle: "自発的対称性の破れとゲージ場の質量獲得",
    slideSlug: "自発的対称性の-破れ-とゲージ場の質量獲得",
  },
  {
    team: "condensed-matter",
    csvTitle: "相から(量子)多体系を統一的に理解したい",
    slideSlug: "相から-量子-多体系を統一的に理解したい",
  },
  {
    team: "experimental",
    csvTitle: "サイクロトロン製作プロジェクト2026",
    slideSlug: "サイクロトロン製作プロジェクト-2026",
  },
  {
    team: "experimental",
    csvTitle: "ノーベル物理学賞!グラフェンって何がすごい？",
    slideSlug: "ノーベル物理学賞-グラフェンって何がすごい",
  },
  {
    team: "experimental",
    csvTitle: "何が２次元なのか？",
    slideSlug: "何が二次元なのか",
  },
  {
    team: "experimental",
    csvTitle: "実験班2026オーバービュー",
    slideSlug: "実験班-2026-オーバービュー",
  },
];

for (const a of GRAPH_CSV_TITLE_ALIASES) {
  const href = withTrailingSlash(`/teams/${a.team}/pdf/${a.slideSlug}`);
  for (const vk of variantKeys(a.csvTitle)) {
    hrefByTeamAndKey.set(`${a.team}\0${vk}`, href);
  }
}

/**
 * サイト上の PDF 表題・班から canonical な `/teams/.../pdf/.../` を返す（未一致時は null）
 */
export function resolvePdfPageHrefForTitle(
  teamSlug: TeamSlug,
  title: string,
): string | null {
  for (const vk of variantKeys(title)) {
    const hit = hrefByTeamAndKey.get(`${teamSlug}\0${vk}`);
    if (hit?.includes("/pdf/")) return hit;
  }

  const fullKey = graphTitleMatchKey(title);
  let best: { href: string; len: number } | null = null;

  for (const row of COMPLETED_SLIDES) {
    if (row.teamSlug !== teamSlug) continue;
    const sk = graphTitleMatchKey(row.title);
    if (sk.length < 4) continue;
    const n = titleMatchScore(fullKey, sk);
    if (n >= 8 && (!best || n > best.len)) {
      best = {
        len: n,
        href: withTrailingSlash(`/teams/${teamSlug}/pdf/${row.slug}`),
      };
    }
  }

  for (const p of FINISHED_POSTERS) {
    if (p.teamSlug !== teamSlug) continue;
    const fk = graphTitleMatchKey(p.title);
    if (fk.length < 4) continue;
    const n = titleMatchScore(fullKey, fk);
    if (n >= 8 && (!best || n > best.len)) {
      best = {
        len: n,
        href: withTrailingSlash(`/teams/${p.teamSlug}/pdf/${p.slug}`),
      };
    }
  }

  return best?.href ?? null;
}

/**
 * メイングラフ用: CSV 1 行の表題・班ラベルから内部 URL（`/teams/.../pdf/...`、未一致時は班トップ）
 */
export function resolvePosterGraphInternalUrl(
  csvTitle: string,
  csvTeamLabel: string,
): string {
  const team = POSTER_GRAPH_CSV_TEAM_TO_SLUG[csvTeamLabel];
  if (!team) return withTrailingSlash("/articles");

  for (const vk of variantKeys(csvTitle)) {
    const hit = hrefByTeamAndKey.get(`${team}\0${vk}`);
    if (hit) return hit;
  }

  const fullKey = graphTitleMatchKey(csvTitle);
  let best: { href: string; len: number } | null = null;

  for (const row of COMPLETED_SLIDES) {
    if (row.teamSlug !== team) continue;
    const sk = graphTitleMatchKey(row.title);
    if (sk.length < 4) continue;
    const n = titleMatchScore(fullKey, sk);
    if (n >= 8 && (!best || n > best.len)) {
      best = {
        len: n,
        href: withTrailingSlash(`/teams/${team}/pdf/${row.slug}`),
      };
    }
  }

  if (!best) {
    for (const p of FINISHED_POSTERS) {
      if (p.teamSlug !== team) continue;
      const fk = graphTitleMatchKey(p.title);
      if (fk.length < 4) continue;
      const n = titleMatchScore(fullKey, fk);
      if (n >= 8 && (!best || n > best.len)) {
        best = {
          len: n,
          href: withTrailingSlash(`/teams/${p.teamSlug}/pdf/${p.slug}`),
        };
      }
    }
  }

  if (best) return best.href;

  return withTrailingSlash(`/teams/${team}`);
}
