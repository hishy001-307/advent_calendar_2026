import TeamPage from "@/components/TeamPage/TeamPage";

export default function ComputationalMathTeamPage() {
  return (
    <TeamPage
      teamName="計算・数理物理班"
      description="計算・数理物理班の活動紹介ページです。"
      loadingVariant="computationalMath"
      fieldSummaryLines={[
        "「数理物理」「計算物理」と聞いてもいまいちピンとこない方もいるかもしれません。数理物理、計算物理の定義は色々ありますが、一言で言うと \"数理物理＝数学と物理の境界領域\"、 \"計算物理＝計算機科学と物理の境界領域\" となるかと思います。主に、数理物理では物理学者が考えた \"いい加減な\" 理論を、きちんと数学の言葉で定式化すると言うことが行われていて、計算物理では物理の解析的に解けない問題を、コンピュータで数値的に解くということが行われています。これは物理→数学・計算機科学という方向ですが、逆に数学の問題を物理学者が \"いい加減\" な方法で解いたり、機械学習を統計物理で説明する、というような数学・計算機科学→物理という方向の研究もあります。",
      ]}
    />
  );
}
