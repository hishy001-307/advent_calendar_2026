"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { publicPath } from "@/utils/publicPath";
import { resolvePosterGraphInternalUrl } from "@/data/posterGraphUrlResolve";
import {
  buildEdges,
  colorForPoster,
  parsePostersCsv,
  teamBaseColor,
  teamLegend,
  type GraphEdge,
  type Poster,
} from "./posterGraphData";
import styles from "./PosterGraph.module.scss";

type SimNode = {
  id: number;
  poster: Poster;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** ドラッグ中の固定座標。null のときは物理シミュレーションに従う。 */
  fx: number | null;
  fy: number | null;
  radius: number;
  color: string;
};

type DragState = {
  pointerId: number;
  nodeId: number;
  /** ノード中心からポインタまでのオフセット（ノードがポインタにジャンプするのを防ぐ） */
  offsetX: number;
  offsetY: number;
  /** 移動量が閾値を超えたら true。クリック判定との切り分けに使う。 */
  moved: boolean;
  startClientX: number;
  startClientY: number;
};

type Tooltip = {
  x: number;
  y: number;
  poster: Poster;
  /** クリックで遷移できる（常にサイト内パス `/teams/...`） */
  hasUrl: boolean;
};

/** CSV 内容が変わるたびに同じシード → 同じ初期配置（更新のたびにグラフを“作り直した”ように見える） */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CLICK_THRESHOLD_PX = 5;
const REPULSION = 1900;
const SPRING_STRONG = { length: 82, k: 0.045 };
const SPRING_WEAK = { length: 160, k: 0.009 };
const CENTER_GRAVITY = 0.0035;
const ANCHOR_GRAVITY = 0.018;
const DAMPING = 0.86;
const VELOCITY_CAP = 8;

/** キャンバス幅に応じたノード・班バブルの縮尺（スマホで重なりを抑える） */
function graphLayoutScale(width: number): number {
  if (width >= 720) return 1;
  if (width >= 480) return 0.84;
  return 0.68;
}

/** 難易度が低いほど大きい丸（やさしい話題ほど目立つ） */
function radiusForDifficulty(d: 1 | 2 | 3, canvasWidth: number): number {
  // 1 → 13.5 / 2 → 11 / 3 → 8.5（デスクトップ基準）
  const base = 16 - d * 2.5;
  return base * graphLayoutScale(canvasWidth);
}

function applyNodeRadii(nodes: SimNode[], canvasWidth: number): void {
  for (const n of nodes) {
    n.radius = radiusForDifficulty(n.poster.difficulty, canvasWidth);
  }
}

/** 班ごとの「中心アンカー」位置を、班の出現順で円周上に等間隔配置で計算する。 */
function computeTeamAnchors(
  teams: string[],
  width: number,
  height: number,
): Map<string, { x: number; y: number }> {
  const anchors = new Map<string, { x: number; y: number }>();
  if (teams.length === 0) return anchors;
  const cx = width / 2;
  const cy = height / 2;
  const R = Math.min(width, height) * 0.32;
  // 1つだけなら中心
  if (teams.length === 1) {
    anchors.set(teams[0], { x: cx, y: cy });
    return anchors;
  }
  teams.forEach((t, i) => {
    const a = (i / teams.length) * Math.PI * 2 - Math.PI / 2;
    anchors.set(t, { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R });
  });
  return anchors;
}

function isOpenableUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function isInternalAppPath(url: string): boolean {
  const u = url.trim();
  return u.startsWith("/") && !u.startsWith("//");
}

function isNavigableUrl(url: string): boolean {
  return isOpenableUrl(url) || isInternalAppPath(url);
}

export default function PosterGraph() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const nodesRef = useRef<SimNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const teamOrderRef = useRef<string[]>([]);
  const sizeRef = useRef({ width: 800, height: 600 });
  const dprRef = useRef(1);
  const dragRef = useRef<DragState | null>(null);
  const hoveredIdRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  const [posters, setPosters] = useState<Poster[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [legend, setLegend] = useState<{ team: string; color: string }[]>([]);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // CSV を読み込んで Poster[] / Edge[] を構築する
  useEffect(() => {
    let cancelled = false;
    fetch(publicPath("/poster_tags_export.csv"), { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`status ${r.status}`);
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        const raw = parsePostersCsv(text);
        const ps = raw.map((p) => ({
          ...p,
          url: resolvePosterGraphInternalUrl(p.title, p.team),
        }));
        const es = buildEdges(ps);
        const order: string[] = [];
        const seen = new Set<string>();
        ps.forEach((p) => {
          if (p.team && !seen.has(p.team)) {
            seen.add(p.team);
            order.push(p.team);
          }
        });
        teamOrderRef.current = order;
        setPosters(ps);
        setEdges(es);
        setLegend(teamLegend(ps));
        setStatus(ps.length > 0 ? "ready" : "error");
        if (ps.length === 0) setErrorMessage("ポスターデータが空です");
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setErrorMessage(e instanceof Error ? e.message : String(e));
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // posters が確定したらノード（位置・色・半径）を初期化する
  useEffect(() => {
    if (posters.length === 0) return;
    const { width, height } = sizeRef.current;
    const anchors = computeTeamAnchors(teamOrderRef.current, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const jitter = 60 * graphLayoutScale(width);
    const layoutSeed = hashString(
      posters
        .map(
          (p) =>
            `${p.id}\t${p.title}\t${p.team}\t${p.subtag}\t${p.related.join("|")}`,
        )
        .join("\n"),
    );
    const rand = mulberry32(layoutSeed);
    nodesRef.current = posters.map((p) => {
      // 班ごとに、その班のアンカー周辺へ初期配置（最初から班ごとにまとまって見える）
      const anchor = anchors.get(p.team) ?? { x: cx, y: cy };
      return {
        id: p.id,
        poster: p,
        x: anchor.x + (rand() - 0.5) * jitter,
        y: anchor.y + (rand() - 0.5) * jitter,
        vx: 0,
        vy: 0,
        fx: null,
        fy: null,
        radius: radiusForDifficulty(p.difficulty, width),
        color: colorForPoster(p.team, p.difficulty),
      };
    });
    edgesRef.current = edges;
  }, [posters, edges]);

  // 親要素サイズに追従して canvas のピクセルサイズ・DPR を更新
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const apply = (rawWidth: number) => {
      const w = Math.max(280, Math.round(rawWidth));
      // 縦も大きめにして、班バブル＋ノードがゆったり配置できるようにする
      const h = Math.round(Math.max(440, Math.min(w * 0.78, 700)));
      sizeRef.current = { width: w, height: h };
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    const syncLayout = (rawWidth: number) => {
      apply(rawWidth);
      if (nodesRef.current.length > 0) {
        applyNodeRadii(nodesRef.current, sizeRef.current.width);
      }
    };

    syncLayout(container.clientWidth);
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        syncLayout(entry.contentRect.width);
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [posters.length]);

  // requestAnimationFrame で物理シミュレーション + 描画を回す
  useEffect(() => {
    if (posters.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = () => {
      const anchors = computeTeamAnchors(
        teamOrderRef.current,
        sizeRef.current.width,
        sizeRef.current.height,
      );
      stepSimulation(
        nodesRef.current,
        edgesRef.current,
        sizeRef.current,
        anchors,
      );
      renderGraph(
        ctx,
        nodesRef.current,
        edgesRef.current,
        sizeRef.current,
        dprRef.current,
        hoveredIdRef.current,
      );
      animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [posters]);

  const findNodeAt = useCallback((px: number, py: number): SimNode | null => {
    const nodes = nodesRef.current;
    // 描画順は配列順。後から描かれた（上にある）ものを優先するため逆走査。
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const dx = px - n.x;
      const dy = py - n.y;
      const r = n.radius + 4;
      if (dx * dx + dy * dy <= r * r) return n;
    }
    return null;
  }, []);

  const eventToCanvas = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    [],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = eventToCanvas(e);
    const node = findNodeAt(x, y);
    if (!node) return;
    canvasRef.current!.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      nodeId: node.id,
      offsetX: x - node.x,
      offsetY: y - node.y,
      moved: false,
      startClientX: e.clientX,
      startClientY: e.clientY,
    };
    node.fx = node.x;
    node.fy = node.y;
    hoveredIdRef.current = node.id;
    setTooltip({
      x,
      y,
      poster: node.poster,
      hasUrl: isNavigableUrl(node.poster.url),
    });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = eventToCanvas(e);
    const drag = dragRef.current;
    const canvas = canvasRef.current!;
    if (drag && drag.pointerId === e.pointerId) {
      const dx = e.clientX - drag.startClientX;
      const dy = e.clientY - drag.startClientY;
      if (!drag.moved && Math.hypot(dx, dy) > CLICK_THRESHOLD_PX) {
        drag.moved = true;
      }
      const node = nodesRef.current.find((n) => n.id === drag.nodeId);
      if (node) {
        const { width, height } = sizeRef.current;
        const r = node.radius;
        node.fx = Math.max(r, Math.min(width - r, x - drag.offsetX));
        node.fy = Math.max(r, Math.min(height - r, y - drag.offsetY));
        setTooltip({
          x: node.fx,
          y: node.fy,
          poster: node.poster,
          hasUrl: isNavigableUrl(node.poster.url),
        });
      }
      return;
    }
    const node = findNodeAt(x, y);
    const newId = node ? node.id : null;
    if (hoveredIdRef.current !== newId) {
      hoveredIdRef.current = newId;
      canvas.style.cursor = node ? "pointer" : "grab";
    }
    if (node) {
      setTooltip({
        x,
        y,
        poster: node.poster,
        hasUrl: isNavigableUrl(node.poster.url),
      });
    } else if (tooltip) {
      setTooltip(null);
    }
  };

  const finishPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    const canvas = canvasRef.current!;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const node = nodesRef.current.find((n) => n.id === drag.nodeId);
    if (node) {
      node.fx = null;
      node.fy = null;
    }
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {
      // 既に解放済みの場合は無視
    }
    if (!drag.moved && node) {
      const url = node.poster.url.trim();
      if (!url) return;
      if (isInternalAppPath(url)) {
        router.push(url);
      } else if (isOpenableUrl(url)) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    }
    dragRef.current = null;
  };

  const onPointerLeave = () => {
    hoveredIdRef.current = null;
    setTooltip(null);
  };

  return (
    <section className={styles.section} aria-label="ポスター関連図">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Poster Network</p>
        <h2 className={styles.title}>ポスター関連図</h2>
      </header>

      <div ref={containerRef} className={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishPointer}
          onPointerCancel={finishPointer}
          onPointerLeave={onPointerLeave}
          role="img"
          aria-label={`${posters.length || ""} 件のポスターからなる関連グラフ`}
        />
        {tooltip && (
          <div
            className={styles.tooltip}
            style={{
              left: `${tooltip.x + 14}px`,
              top: `${tooltip.y + 14}px`,
            }}
            aria-hidden
          >
            <div className={styles.tooltipTitle}>{tooltip.poster.title}</div>
            <div className={styles.tooltipMeta}>
              <span
                className={styles.tooltipBadge}
                style={{
                  background: colorForPoster(
                    tooltip.poster.team,
                    tooltip.poster.difficulty,
                  ),
                }}
              >
                {tooltip.poster.team || "未分類"}
              </span>
              <span className={styles.tooltipMetaText}>
                {tooltip.poster.subtag && `${tooltip.poster.subtag}・`}
                難易度 {tooltip.poster.difficulty}
              </span>
            </div>
            {tooltip.poster.author && (
              <div className={styles.tooltipAuthor}>
                {tooltip.poster.author}
              </div>
            )}
            {/* <div className={styles.tooltipHint}>
              {tooltip.hasUrl ? "クリックで PDF ページを開く" : "リンクは準備中です"}
            </div> */}
          </div>
        )}
        {/* {status === "loading" && (
          <div className={styles.statusOverlay}>関連図を読み込み中...</div>
        )}
        {status === "error" && (
          <div className={`${styles.statusOverlay} ${styles.error}`}>
            ポスターデータの読み込みに失敗しました
            {errorMessage ? `（${errorMessage}）` : ""}
          </div>
        )} */}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendGroup}>
          <span className={styles.legendLabel}>班</span>
          {legend.map((l) => (
            <span key={l.team} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: l.color }}
                aria-hidden
              />
              {l.team}
            </span>
          ))}
        </div>
        <div className={styles.legendGroup}>
          <span className={styles.legendLabel}>難易度</span>
          <span className={styles.legendItem}>
            <span className={styles.legendBar}>
              <span
                className={styles.legendStep}
                style={{ background: colorForPoster("素粒子物理班", 1) }}
                aria-hidden
              />
              <span
                className={styles.legendStep}
                style={{ background: colorForPoster("素粒子物理班", 2) }}
                aria-hidden
              />
              <span
                className={styles.legendStep}
                style={{ background: colorForPoster("素粒子物理班", 3) }}
                aria-hidden
              />
            </span>
            やさしい → むずかしい
          </span>
        </div>
      </div>
    </section>
  );
}

// --- Force-directed layout helpers ---

function stepSimulation(
  nodes: SimNode[],
  edges: GraphEdge[],
  size: { width: number; height: number },
  teamAnchors: Map<string, { x: number; y: number }>,
): void {
  if (nodes.length === 0) return;
  const { width, height } = size;
  const layoutScale = graphLayoutScale(width);
  const repulsion = REPULSION * layoutScale * layoutScale;
  const cx = width / 2;
  const cy = height / 2;

  for (let i = 0; i < nodes.length; i++) {
    nodes[i].vx *= DAMPING;
    nodes[i].vy *= DAMPING;
  }

  // ノード間斥力（クーロン則的に距離の二乗で減衰）
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d2 = dx * dx + dy * dy + 0.01;
      const d = Math.sqrt(d2);
      const force = repulsion / d2;
      const fx = (dx / d) * force;
      const fy = (dy / d) * force;
      a.vx -= fx;
      a.vy -= fy;
      b.vx += fx;
      b.vy += fy;
    }
  }

  // エッジに沿ったバネ力（明示関連は強く・タグ共有は弱く）
  for (const e of edges) {
    const a = nodes[e.source];
    const b = nodes[e.target];
    if (!a || !b) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
    const params = e.strength >= 1 ? SPRING_STRONG : SPRING_WEAK;
    const force = (d - params.length * layoutScale) * params.k;
    const fx = (dx / d) * force;
    const fy = (dy / d) * force;
    a.vx += fx;
    a.vy += fy;
    b.vx -= fx;
    b.vy -= fy;
  }

  // 中心方向への弱い重力（全体が散逸しすぎないように）
  for (const n of nodes) {
    n.vx += (cx - n.x) * CENTER_GRAVITY;
    n.vy += (cy - n.y) * CENTER_GRAVITY;
  }

  // 班ごとの「アンカー位置」へ引き寄せる（画面全体に班を均等配置）
  for (const n of nodes) {
    const anchor = teamAnchors.get(n.poster.team);
    if (!anchor) continue;
    n.vx += (anchor.x - n.x) * ANCHOR_GRAVITY;
    n.vy += (anchor.y - n.y) * ANCHOR_GRAVITY;
  }

  // 位置更新
  for (const n of nodes) {
    if (n.fx !== null && n.fy !== null) {
      n.x = n.fx;
      n.y = n.fy;
      n.vx = 0;
      n.vy = 0;
      continue;
    }
    if (n.vx > VELOCITY_CAP) n.vx = VELOCITY_CAP;
    if (n.vx < -VELOCITY_CAP) n.vx = -VELOCITY_CAP;
    if (n.vy > VELOCITY_CAP) n.vy = VELOCITY_CAP;
    if (n.vy < -VELOCITY_CAP) n.vy = -VELOCITY_CAP;
    n.x += n.vx;
    n.y += n.vy;
    const r = n.radius;
    if (n.x < r) {
      n.x = r;
      n.vx *= -0.4;
    } else if (n.x > width - r) {
      n.x = width - r;
      n.vx *= -0.4;
    }
    if (n.y < r) {
      n.y = r;
      n.vy *= -0.4;
    } else if (n.y > height - r) {
      n.y = height - r;
      n.vy *= -0.4;
    }
  }
}

/** 班ごとに「中心・半径」を計算し、班バブル描画用のレイアウトを返す。 */
function computeTeamLayout(
  nodes: SimNode[],
  canvasWidth: number,
): Map<string, { cx: number; cy: number; radius: number; rgb: [number, number, number] }> {
  const scale = graphLayoutScale(canvasWidth);
  const minBubble = 48 * scale;
  const bubblePad = 22 * scale;
  const acc = new Map<
    string,
    { sx: number; sy: number; n: number; members: SimNode[] }
  >();
  for (const n of nodes) {
    if (!n.poster.team) continue;
    const cur = acc.get(n.poster.team);
    if (cur) {
      cur.sx += n.x;
      cur.sy += n.y;
      cur.n += 1;
      cur.members.push(n);
    } else {
      acc.set(n.poster.team, { sx: n.x, sy: n.y, n: 1, members: [n] });
    }
  }
  const out = new Map<
    string,
    { cx: number; cy: number; radius: number; rgb: [number, number, number] }
  >();
  acc.forEach((v, key) => {
    const cx = v.sx / v.n;
    const cy = v.sy / v.n;
    let maxD = 0;
    for (const m of v.members) {
      const d = Math.hypot(m.x - cx, m.y - cy) + m.radius;
      if (d > maxD) maxD = d;
    }
    out.set(key, {
      cx,
      cy,
      radius: Math.max(minBubble, maxD + bubblePad),
      rgb: teamBaseColor(key),
    });
  });
  return out;
}

function renderGraph(
  ctx: CanvasRenderingContext2D,
  nodes: SimNode[],
  edges: GraphEdge[],
  size: { width: number; height: number },
  dpr: number,
  hoveredId: number | null,
): void {
  const { width, height } = size;
  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  // --- 班バブル（背景レイヤ） ---
  const teamLayout = computeTeamLayout(nodes, width);
  teamLayout.forEach((layout) => {
    const [r, g, b] = layout.rgb;
    const grad = ctx.createRadialGradient(
      layout.cx,
      layout.cy,
      0,
      layout.cx,
      layout.cy,
      layout.radius,
    );
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.22)`);
    grad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.10)`);
    grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(layout.cx, layout.cy, layout.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  const neighbors = new Set<number>();
  if (hoveredId !== null) {
    for (const e of edges) {
      if (e.source === hoveredId) neighbors.add(e.target);
      else if (e.target === hoveredId) neighbors.add(e.source);
    }
  }

  for (const e of edges) {
    const a = nodes[e.source];
    const b = nodes[e.target];
    if (!a || !b) continue;
    const isHovered =
      hoveredId !== null && (e.source === hoveredId || e.target === hoveredId);
    if (e.strength >= 1) {
      ctx.strokeStyle = isHovered
        ? "rgba(60, 60, 60, 0.85)"
        : "rgba(110, 110, 110, 0.32)";
      ctx.lineWidth = isHovered ? 2.0 : 1.2;
    } else {
      // 弱いエッジ：何もホバーされていないときのみ薄く描画
      if (hoveredId !== null && !isHovered) continue;
      ctx.strokeStyle = isHovered
        ? "rgba(160, 160, 160, 0.5)"
        : "rgba(170, 170, 170, 0.16)";
      ctx.lineWidth = isHovered ? 1.0 : 0.7;
    }
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  for (const n of nodes) {
    const isHovered = n.id === hoveredId;
    const isNeighbor = neighbors.has(n.id);
    const dim = hoveredId !== null && !isHovered && !isNeighbor;
    ctx.globalAlpha = dim ? 0.32 : 1.0;
    ctx.fillStyle = n.color;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
    ctx.stroke();
    if (isHovered) {
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "rgba(40, 40, 40, 0.55)";
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius + 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // --- 班ラベル（最前面・班の重心位置に描画）---
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  teamLayout.forEach((layout, team) => {
    const [r, g, b] = layout.rgb;
    const labelScale = graphLayoutScale(width);
    const fontSize = Math.max(13 * labelScale, Math.min(layout.radius * 0.36, 30));
    ctx.font = `700 ${fontSize}px "Zen Maru Gothic", "Hiragino Sans", "Noto Sans JP", sans-serif`;
    // 太い白縁取りで、ノードや線の上でも読めるようにする
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(255, 253, 247, 0.92)";
    ctx.strokeText(team, layout.cx, layout.cy);
    ctx.fillStyle = `rgba(${Math.round(r * 0.45)}, ${Math.round(g * 0.45)}, ${Math.round(b * 0.45)}, 0.95)`;
    ctx.fillText(team, layout.cx, layout.cy);
  });

  ctx.restore();
}
