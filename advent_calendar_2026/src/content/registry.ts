// src/content/registry.ts
// ここに存在する day だけを import できるように明示マップ化
export const adventRegistry: Record<number, () => Promise<any>> = {
  1: () => import('./advent/1.mdx'),
  2: () => import('./advent/2.mdx'),
  // ...必要に応じて追加
};

// 有効な day の範囲をアプリで使い回せるように
export const VALID_DAYS = Object.keys(adventRegistry).map((k) => Number(k));
