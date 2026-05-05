import TeamPage from "@/components/TeamPage/TeamPage";

export default function CondensedMatterTeamPage() {
  return (
    <TeamPage
      teamName="物性物理班"
      description="物性物理班の活動紹介ページです。"
      loadingVariant="condensedMatter"
      fieldSummaryLines={[
        "物性物理とは、大まかには「身の回りの物質」（あるいはまだ世の中に存在しない物質）のいろんな性質を調べる学問です。",
        "ほぼ対応する英語は \"condensed matter physics\" (凝縮系物理学)ですが、要するには原子や電子がたくさん集まってできた物質、特に固体が 主な研究対象です。様々な系について、温度依存性などを見る、外場に対する応答を調べる、のようなことが基本的な興味になりますが、研究テーマは本当に多種多様なものに広がっています",
      ]}
    />
  );
}
