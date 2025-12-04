import React from "react";

export default function About() {
  return (
    <section className="mx-auto max-w-5xl px-4 pt-6 pb-6 bg-white rounded-md shadow-sm">
      <h2 className="text-2xl font-semibold text-[#444443] mb-2">Physics Labとは？</h2>
      <p className="text-sm text-zinc-700 mb-3">
        Physics Lab は大学生・若手研究者を中心に物理・計算・実験・数理分野の知見を共有するコミュニティです。イベントや記事で学びの場を提供し、研究や学習の交流を促進します。
      </p>

      <div className="text-sm text-zinc-600">
        <h3 className="font-medium mt-2">目的</h3>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>学びの共有とアウトプットの場を作る</li>
          <li>学生間の交流・共同研究のきっかけを作る</li>
          <li>専門的な知見をわかりやすく紹介する</li>
        </ul>
      </div>
    </section>
  );
}