import TeamPage from "@/components/TeamPage/TeamPage";

export default function AstrophysicsTeamPage() {
  return (
    <TeamPage
      teamName="宇宙物理班"
      description="宇宙物理班の活動紹介ページです。"
      loadingVariant="astrophysics"
      fieldSummaryLines={[
        "宇宙班では、広大な宇宙を舞台に、物理学の法則がどのように現れるのかを探求します。恒星の進化、ブラックホールの時空、銀河の形成、そして宇宙全体の成り立ちなど、扱うテーマは物理学のフロンティアそのものです。極微のプランクスケール ($10^{-35}\\,\\mathrm{m}$) から宇宙全体を貫くエネルギー ($10^{19}\\,\\mathrm{GeV}$) までを繋ぐ、唯一無二の学問分野と言えるでしょう。",
        "これらの謎を解き明かすには、流体力学や場の理論、一般相対性理論、素粒子論といった物理学の深い知識が不可欠であり、宇宙物理学/天文学はまさに \"物理学の総合格闘技\" とも言える分野です。宇宙物理学を学ぶ人はそのリング上に立つことを目指して日々邁進しています。",
      ]}
    />
  );
}
