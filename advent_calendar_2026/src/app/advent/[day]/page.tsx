import { notFound } from 'next/navigation';
import { adventRegistry, VALID_DAYS } from '@/content/registry';

// type Props = { params: { day: string } };

export default async function AdventEntry({ params }: { params: { day: string } }) {

  // デバッグ：実際の params をログ
  const resolved = await params;
  console.log('advent params:', resolved);

  const raw = resolved?.day;
  if (typeof raw !== 'string' || !/^\d+$/.test(raw)) {
    console.warn('invalid day param:', raw);
    notFound();
  }

  const day = parseInt(raw, 10);

  // バリデーション：整数 & 範囲内のみ許可
  if (Number.isNaN(day) || day < 1 || day > 25) {
        // 無効な day の場合は 404 を返す
        notFound();
    }


  // ここでデータ取得（MDXやJSON、CMS）に差し替え可能
//   return (
//     <main className="mx-auto max-w-3xl px-4 py-10">
//       <h1 className="text-3xl font-bold">Advent Day {day}</h1>
//       <p className="mt-4">
//         ここに {day} 日目の記事内容を表示（ダミー）。あとで本物の本文に差し替えます。
//       </p>
//     </main>

 const MDXModule = await adventRegistry[day]();
  const MDXContent = MDXModule.default; // MDXはデフォルトエクスポート（React要素）

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 prose prose-zinc">
      {/* タイトルなど、frontmatterが欲しければ MDXModule.frontmatter で受ける実装も可 */}
      <h1 className="text-3xl font-bold">Advent Day {day}</h1>
      <MDXContent />
    </main>
  );
}