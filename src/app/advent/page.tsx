"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header/Header";

import Footer from "@/components/Footer/Footer";

import { getDateStatus } from "@/utils/date";


// ==== 設定：どの年の12月か ====
const ADVENT_YEAR = 2025;
const ADVENT_MONTH = 11; // 0-based（11 = 12月）

// ==== シリーズ定義 ====
const SERIES = [
  { id: "series1", label: "シリーズ1" },
  { id: "series2", label: "シリーズ2" },
];

type AdventEntry = {
  date: string;      // "2026-12-01" 形式
  label: string;     // カレンダーに出す短いタイトル
  author?: string;    // 著者名
  href: string;      // 記事ページへのリンク
  seriesId: string;  // "series1" | "series2"
  abstract?: string; // アブストラクト（オプション）
  externalLink?: string; // 外部リンク（mathlog等）
};

// ==== 記事データ ====
const ADVENT_ENTRIES: AdventEntry[] = [
  // ==== シリーズ1のデータ（CSVより） ====
  // 1日
  {
    date: "2025-12-01",
    label: "Physlab2026挨拶",
    author: "Hiro",
    href: "/advent/series1/1",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/fftYodHsDAp74ymsbyIG",
    abstract: "記念すべき初日のテーマは「Physics Lab. 2026の紹介」です。私たちの活動の全貌をぜひご覧ください！",
  },
  // 2日
  {
    date: "2025-12-02",
    label: "運営紹介と理物生の1日",
    author: "Ping",
    href: "/advent/series1/2",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/Dk02hUxpTV1TGNUP2C3L",
    abstract: "2日目の記事は『運営紹介と理物生の1日』です！物理学科の学生の不思議な生態がわかるかも？ぜひご覧ください！✨",
  },
  // 3日
  {
    date: "2025-12-03",
    label: "素粒子物理班紹介",
    author: "chuff",
    href: "/advent/series1/3",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/8FdaNR1R5ulpsyls5qWN",
    abstract: "3日目の記事は『素粒子物理班紹介』です！物理学の王道、素粒子物理を志す者たちは一体どんなことを学んでいるのでしょうか...?",
  },
  // 4日
  {
    date: "2025-12-04",
    label: "物性物理班紹介",
    author: "sugi",
    href: "/advent/series1/4",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/9E7Qdcuk2sYGiHlMM9et",
    abstract: "本日の記事は『物性物理班紹介』です！「物性物理」って結局どんな分野？半導体や超伝導も、実はミクロとマクロを繋ぐ物理の賜物。単なる性質調べではない、この学問の独特な考え方の面白さ紹介します！",
  },
  // 5日
  {
    date: "2025-12-05",
    label: "宇宙物理班紹介",
    author: "ほるみる",
    href: "/advent/series1/5",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/sIZnNTlwcCFGcqu3Lqi2",
    abstract: "本日は『宇宙物理班紹介』です！広範な物理分野が交錯する壮大な舞台、宇宙。相対論や宇宙論など、やや理系に偏った私たちが挑んでいる「愛読書」を「愛数式」を交えて紹介します！✨",
  },
  // 6日
  {
    date: "2025-12-06",
    label: "計算・数理物理班紹介",
    author: "なべ",
    href: "/advent/series1/6",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/oT25k09FobPFpBDLnFWf",
    abstract: "本日の記事は『計算・数理物理班紹介』です！物理を支えるのは、厳密な「数学」の言葉。コンピュータも使って、手計算では解けない複雑な現象をシミュレーションする。そんな「計算と数理」の世界へご招待！",
  },
  // 7日
  {
    date: "2025-12-07",
    label: "生物物理班紹介",
    author: "mikann",
    href: "/advent/series1/7",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/xqvVJmRTDIoj5RcYkhRY",
    abstract: "今日の更新は『生物物理班紹介』！「生命を物理で説明する？」非平衡、アクティブマター、スケーリング…多彩なアプローチで“生命らしさ”を読み解く学問、生物物理の魅力を紹介しています！",
  },
  // 8日
  {
    date: "2025-12-08",
    label: "実験班紹介",
    author: "メラゾーマ",
    href: "/advent/series1/8",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/JVMg5xu3VWazD4SR6kqs",
    abstract: "本日は『実験物理班紹介』！理論だけでは物理は語れない。実験こそ“現象が語る真実”——光速測定やオーロラ生成など、学生が挑む本格プロジェクトを紹介！",
  },
  // 9日
  {
    date: "2025-12-09",
    label: "テンソルネットワークで紡ぐ宇宙　~1.イジング模型~",
    author: "Hiro",
    href: "/advent/series1/9",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/m1QKo1KEZehFE71cC8nB",
    abstract: "班紹介を終え、本日は『テンソルネットワークで紡ぐ宇宙』シリーズ1作目！ 難しそうな物理も、図でつなげばスッと見える。 イジング模型から始まる“お絵かきで理解する物理”をわかりやすく紹介！",
  },
  // 10日
  {
    date: "2025-12-10",
    label: "宇宙の時間を巻き戻す方法 — Λ-CDMモデルで知る宇宙の広さと年齢",
    author: "ほるみる",
    href: "/advent/series1/10",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/xqhtDr9gOG6HbpSkq0KL",
    abstract: "本日の記事は『宇宙の時間を巻き戻す方法』です。夜空を見上げるとき、私たちは「過去」を見ています。 138億年かけて届く光。その果ては465億光年彼方。一般相対性理論が描く、時空の壮大な物語をどうぞ。",
  },
  // 11日
  {
    date: "2025-12-11",
    label: "誤差解析論考１",
    author: "Physixしあ",
    href: "/advent/series1/11",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/c74ZFoZYBTrGLEC7homr",
    abstract: "『誤差解析論考1』公開しました！「私たちは実験結果から何を知るのか？」 実験の信頼性を支え、そして理論との繋ぎ目となる「不確かさ」について、 物理学生にも、一般の方にも役立つ形で噛み砕いた入門です！",
  },
  // 12日
  {
    date: "2025-12-12",
    label: "固体物理入門：波数空間を丸めてあそぼ",
    author: "sugi",
    href: "/advent/series1/12",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/aHspo9UgEFzUP7rup6sN",
    abstract: "電子の質量が「負」になる！？ 結晶というジャングルジムの中では、電子は自由空間とは違う動きを見せます。結晶運動量やバンド構造を直観的に理解して遊んでみませんか？",
  },
  // 13日
  {
    date: "2025-12-13",
    label: "極座標ラプラシアンと友達になろう ～ホッジスター演算子～",
    author: "なべ",
    href: "/advent/series1/13",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/OsEX5w3txJ98kUVPYP8A",
    abstract: "本日の記事は『極座標ラプラシアンと友達になろう』です！面倒な計算は、幾何学の言葉で書き直せる。 基底の微分に悩まされることなく、ホッジスター演算子を使って機械的にベクトル解析の公式を導く方法とは？",
  },
  // 14日
  {
    date: "2025-12-14",
    label: "微分方程式の数値解法とその実装",
    author: "Lucrezia",
    href: "/advent/series1/14",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/ttdiKLpLpICUTq13xB5k",
    abstract: "アドカレも今日から折り返し！本日の記事は『微分方程式の数値解法とその実装』です！物理とは切っても切り離せない数値シミュレーション。その興味深い数理に迫っていきます",
  },
  // 15日
  {
    date: "2025-12-15",
    label: "テンソルネットワークで紡ぐ宇宙~2.くりこみの数理~",
    author: "Hiro",
    href: "/advent/series1/15",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/6uuYfPliKkk7hp2EYCai",
    abstract: "本日は『テンソルネットワークで紡ぐ宇宙』シリーズ2作目！ 時空を角から丸め込む。 指数関数的に爆発する計算量を前に、どう立ち向かうべきか？ テンソルネットワークの計算手法としての側面に注目しながら、時間と空間の対応関係に迫ります！",
  },
  // 16日
  {
    date: "2025-12-16",
    label: "Euclidean Quantum Gravity",
    author: "RelLim",
    href: "/advent/series1/16",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/MqDwvW7yTc394okfXZfD",
    abstract: "本日の記事は『Euclidean Quantum Gravity』です！ なぜブラックホールに「温度」があるのか？ その答えは、時空の性質に隠されていた。 時間を虚数にして、Hawking輻射を場の量子論ではなく「幾何学」から導きます！",
  },
  // 17日
  {
    date: "2025-12-17",
    label: "荷電粒子を曲げたり絞ったり、加速器における磁場の役割",
    author: "メラゾーマ",
    href: "/advent/series1/17",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/DXrVRuEglbymzOieTgF0",
    abstract: "本日の記事は『荷電粒子を曲げたり絞ったり、加速器における磁場の役割』です！ 実験班による「サイクロトロン製作プロジェクト」始動。 実験に向けた理論的背景として、磁場によるビーム収束の物理を解説します",
  },
  // 18日
  {
    date: "2025-12-18",
    label: "ソリトンと古典可積分系",
    author: "makkuroymmn",
    href: "/advent/series1/18",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/M2jKeuN1DTZhfSLbOiBF",
    abstract: "本日の記事は『ソリトンと古典可積分系』です！ 波は崩れるのが当たり前？ 形を変えずに伝わり、衝突しても壊れない不思議な波「ソリトン」 KdV方程式を具体例に、その性質と背後にある数学的構造（可積分系）について、基礎から丁寧に解説します",
  },
  // 19日
  {
    date: "2025-12-19",
    label: "誤差解析論考２　〜 N か N-1 か 〜",
    author: "Physixしあ",
    href: "/advent/series1/19",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/8cbLPDM3oJ0qfiho7ZvI",
    abstract: "本日の記事は『誤差解析論考２　〜 N か N-1 か 〜』です！ 標準偏差を求めるとき、なぜ N ではなく N−1 で割るのか？ 誤差の伝播則って？実験レポートで誰もが抱くあの疑問に決着をつける。 実験データの背後にある統計学の理屈を丁寧に解説します",
  },
  // 20日
  {
    date: "2025-12-20",
    label: "OISTリサーチ・インターンご紹介",
    author: "Bundes",
    href: "/advent/series1/20",
    seriesId: "series1",
    externalLink: "https://note.com/merry_bonobo3763/n/nfb3be24a8245",
    abstract: "本日の記事は『OISTリサーチ・インターンご紹介』です！ 目の前には美しい海、飛び交う英語、そして物理漬けの毎日。 東大を休学して飛び込んだ、沖縄科学技術大学院大学（OIST）での研究インターン生活を等身大の言葉で紹介します。",
  },
  // 21日
  {
    date: "2025-12-21",
    label: "虚数のエネルギーの遊び方～線型代数でわかるグリーン関数～",
    author: "YY",
    href: "/advent/series1/21",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/3bNXe5iGisBUKx0RArYI",
    abstract: "本日の記事は『虚数のエネルギーの遊び方』です！ ハミルトニアンが非エルミートになると現れる「虚数のエネルギー」。 その物理的な正体とは？ グリーン関数と局所状態密度(LDOS)を武器に、数式と相図でその意味を解き明かします。",
  },
  // 22日
  {
    date: "2025-12-22",
    label: "フ。~ペンギンの糞の運動について~",
    author: "さみだれ",
    href: "/advent/series1/22",
    seriesId: "series1",
    externalLink: "https://note.com/immortal_fujimi/n/n5aaab997f00b?sub_rt=share_pb",
    abstract: "本日の記事は『フ。~ペンギンの糞の運動について~』です！ ペンギンはなぜ、あんなにも勢いよく糞を飛ばせるのか？ 掃除機並みの直腸圧、オリーブオイルと同等の粘度。 流体力学が解き明かす、愛らしい鳥の排泄の物理学の秘密に迫ります",
  },
  // 23日
  {
    date: "2025-12-23",
    label: "テンソルネットワークで紡ぐ宇宙~3.MERAからBHへ~",
    author: "Hiro",
    href: "/advent/series1/23",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/L6grqB77lFaIhcYZ5Y28",
    abstract: "シリーズ最終章。TNの構造とAdS時空の等価性、そしてBHの熱力学。 量子と重力が交差する、圧巻のフィナーレへ。",
  },
  // 24日
  {
    date: "2025-12-24",
    label: "クリスマスイブの夜空にオーロラを作り出す方法",
    author: "K2K",
    href: "/advent/series1/24",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/hSTEslI79rTHIeItys0e",
    abstract: "聖夜には奇跡を。なければ作ればいい。 夜空を彩るオーロラ実験の全貌を紹介します。",
  },
  // 25日
  {
    date: "2025-12-25",
    label: "HGP符号の話",
    author: "Jimmy",
    href: "/advent/series1/25",
    seriesId: "series1",
    externalLink: "https://mathlog.info/articles/aTOj0Uiifu79Gd0NdLxH",
    abstract: "量子誤り訂正符号の中でも、符号化率とLDPC性を両立する優れた符号であるHGP符号、その洗練されたメカニズムをコホモロジーの側面から解き明かします！",
  },

  // ==== シリーズ2のデータ（CSVより） ====
  // 3日
  {
    date: "2025-12-03",
    label: "【共形場理論】Virasoro代数のつくりかた",
    author: "Jimmy",
    href: "/advent/series2/3",
    seriesId: "series2",
    abstract: "Virasoro代数がLie代数の中心拡大として得られることを頑張って書きます。",
    externalLink: "https://mathlog.info/articles/vC7gEcCnikTwz6myYlKK",
  },

  // 12日
  {
    date: "2025-12-12",
    label: "お前も物理学徒にならないか？",
    author: "うどん",
    href: "/advent/series2/12",
    seriesId: "series2",
    externalLink: "https://mathlog.info/articles/AIdrUwGtlfWmSbRITGO9",
    abstract: "強い物理学徒になるための方法を紹介しています。東大理物の学生の生態や、物理学の魅力について語ります。",
  },

  // 14日
  {
    date: "2025-12-14",
    label: "量子力学における経路積分",
    author: "うどん",
    href: "/advent/series2/14",
    seriesId: "series2",
    externalLink: "https://mathlog.info/articles/ThXvlU3Ez4ET08F4ZsfL",
    abstract: "「粒子はあらゆる経路を通る」 この直観的な描像は、演算子をただの「数」に変える強力な武器になります。場の量子論への強力な架け橋となるその数理と物理的な嬉しさを紐解いていきます。",
  },
  // 16日
  {
    date: "2025-12-16",
    label: "物理学に必要な食べもの〜イギリス編〜",
    author: "しぶさわ",
    href: "/advent/series2/16",
    seriesId: "series2",
    externalLink: "https://mathlog.info/articles/xqJMfEXFxyRCBCnhrPxi",
    abstract: "1年間の留学生活で出会った、現地の美味しいグルメをたくさんの写真とともに振り返ります🇬🇧 留学先の物理に必要な食べ物を紹介する伝統を引き継ぎます！",
  },
  // 17日
  {
    date: "2025-12-17",
    label: "重みつきカタラン数の不思議な性質とその応用",
    author: "Hiro",
    href: "/advent/series2/17",
    seriesId: "series2",
    externalLink: "https://mathlog.info/articles/b1BJAOOv2xqOV07lj0S1",
    abstract: "小学生でも理解できるルールの先に待っているのは、現代物理学の計算手法でした。 摂動論で登場する ⟨0∣ x^n ∣0⟩ の計算を一瞬で終わらせる、画期的な方法を紹介します！",
  },

  // 21日
  {
    date: "2025-12-21",
    label: "量子100年&ビスマルク生誕210周年なのでドイツの話をする",
    author: "Bundes",
    href: "/advent/series2/21",
    seriesId: "series2",
    externalLink: "https://note.com/merry_bonobo3763/n/nf52e14c594df",
    abstract: "本日2本目は『量子100年&ビスマルク生誕210周年なのでドイツの話をする』です！ 量子力学生誕100年の節目に、ドイツの現代史を学び直しませんか？ 話題の新刊『統一後のドイツ』を読み解くための基礎知識を、物理学科生が徹底解説。",
  },

  // 25日
  {
    date: "2025-12-25",
    label: "超 絶対絶命 でんぢゃらSUSYさん",
    author: "soleil",
    href: "/advent/series2/25",
    seriesId: "series2",
    externalLink: "https://mathlog.info/articles/cdZbRT6eZP0qolux68Yh",
    abstract: "プレゼントがない君へ、でんぢゃらSUSY(スージー)さんからの贈り物！ 超ひも理論が導く10次元時空の世界——標準模型を超える物理の深淵を、漫画形式で楽しく解説するんじゃ。",
  },
];

// 日付文字列 → その日に属するエントリ一覧
const adventMap = ADVENT_ENTRIES.reduce<Record<string, AdventEntry[]>>(
  (acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  },
  {}
);

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// 指定月の6週×7日グリッドを作る
function buildMonthMatrix(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth(); // 0-based

  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = firstOfMonth.getDay(); // 0:日〜6:土

  const lastOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastOfMonth.getDate();

  const lastOfPrevMonth = new Date(year, month, 0);
  const daysInPrevMonth = lastOfPrevMonth.getDate();

  const weeks: {
    date: Date;
    inCurrentMonth: boolean;
  }[][] = [];

  let currentDay = 1;
  let nextMonthDay = 1;

  for (let week = 0; week < 6; week++) {
    const row: { date: Date; inCurrentMonth: boolean }[] = [];

    for (let weekday = 0; weekday < 7; weekday++) {
      const cellIndex = week * 7 + weekday;

      let date: Date;
      let inCurrentMonth = true;

      if (cellIndex < firstWeekday) {
        // 前月の日付
        const day =
          daysInPrevMonth - (firstWeekday - 1) + cellIndex;
        date = new Date(year, month - 1, day);
        inCurrentMonth = false;
      } else if (currentDay > daysInMonth) {
        // 翌月の日付
        date = new Date(year, month + 1, nextMonthDay++);
        inCurrentMonth = false;
      } else {
        // 当月
        date = new Date(year, month, currentDay++);
        inCurrentMonth = true;
      }

      row.push({ date, inCurrentMonth });
    }

    weeks.push(row);
  }

  return weeks;
}

function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function AdventCalendarPage() {
  // シリーズ切り替え
  const [activeSeries, setActiveSeries] = useState<string>("series1");

  // クライアント側でのみ今日の日付を取得（Hydration mismatch回避）
  const [today, setToday] = useState<string | null>(null);

  // 月送りはしないので、ベースの月は固定（12月）
  const baseDate = useMemo(
    () => new Date(ADVENT_YEAR, ADVENT_MONTH, 1),
    []
  );
  const weeks = useMemo(() => buildMonthMatrix(baseDate), [baseDate]);

  // クライアント側マウント後に今日の日付を設定
  useEffect(() => {
    setToday(formatDateKey(new Date()));
  }, []);

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth() + 1;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 pt-8 pb-8 space-y-6">
        {/* ページヘッダ */}
        <header className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Advent Calendar 2026
          </p>
          <h1 className="text-4xl font-semibold text-[#444443]">
            Physics Lab. アドベントカレンダー
          </h1>
          <p className="text-xs text-zinc-500">
            記事が投稿されるのは 12/1 〜 12/25 までです。
          </p>
          <p className="text-xs text-zinc-500">
            シリーズを切り替えて各日の記事をチェックできます。
          </p>
          <p className="text-xs text-zinc-500">
            カーソルを近づけると詳細が表示されます。
          </p>
        </header>

        {/* シリーズ切り替えボタン */}
        <div className="flex justify-center gap-2">
          {SERIES.map((s) => {
            const isActive = s.id === activeSeries;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSeries(s.id)}
                className={[
                  "rounded-full px-4 py-1 text-sm font-medium border transition",
                  isActive
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50",
                ].join(" ")}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* 月タイトル（固定：12月） */}
        <div className="text-center text-lg font-medium text-zinc-800">
          {year}年{month}月
        </div>

        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 border-b text-center text-xs font-medium text-zinc-500 mb-2">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-1">
              {w}
            </div>
          ))}
        </div>

        {/* 壁掛けカレンダー */}
        <div className="grid grid-rows-4 gap-1">
          {weeks.slice(0, 4).map((week, i) => (
            <div key={i} className="grid border-b grid-cols-7 gap-1">
              {/* ↑カレンダーの線はこれ */}
              {week.map(({ date, inCurrentMonth }) => {
                const key = formatDateKey(date);
                const day = date.getDate();

                // アドカレ範囲外は記事なし（リンクなし）
                const inAdventRange =
                  inCurrentMonth && day >= 1 && day <= 25;

                // その日の activeSeries 用のエントリを探す
                const entries = adventMap[key] ?? [];
                const entry = entries.find(
                  (e) => e.seriesId === activeSeries
                );

                const isToday = today !== null && formatDateKey(date) === today;

                const isFuture = today !== null && formatDateKey(date) > today;

                const status = today ? getDateStatus(key, today) : null;


                // 26日以降は表示しない
                if (inCurrentMonth && day > 25) {
                  return null;
                }

                // 1月（翌月）は表示しない
                if (!inCurrentMonth && date.getMonth() === 0) {
                  return null;
                }

                // ベースのスタイル
                let className =
                  "relative h-25 rounded-none text-xs flex flex-col justify-between px-2 py-1";

                if (!inCurrentMonth) {
                  // 前後月
                  className +=
                    " border-zinc-200 bg-zinc-50 text-zinc-300";
                } else if (entry && inAdventRange) {
                  // 記事あり
                  if (isFuture) {
                    // 未来の記事（まだ公開されていない）
                    className +=
                      " border-zinc-300 bg-zinc-100 text-zinc-400 cursor-not-allowed opacity-60";
                  } else {
                    // 公開済みの記事
                    className +=
                      " border-pink-200 bg-pink-100 text-zinc-900";
                  }
                } else {
                  // 当月だが記事なし
                  className +=
                    " border-zinc-200 bg-white text-zinc-700";
                }

                if (!inCurrentMonth) {
                  // 前後月
                  className += " border-zinc-200 bg-zinc-50 text-zinc-300";
                } else if (inAdventRange && status && (status === "tomorrow" || status === "future")) {
                  // 未来（明日含む）：グレー（ロック）
                  className += " border-zinc-200 bg-zinc-100 text-zinc-500";
                } else if (entry && inAdventRange) {
                  // 公開済み記事あり：ピンク
                  className += " border-pink-200 bg-pink-100 text-zinc-900";
                } else {
                  // 当月だが記事なし
                  className += " border-zinc-200 bg-white text-zinc-700";
                }

                if (isToday) {
                  className += " ring-2 ring-zinc-800 ring-offset-2";
                }

                const inner = (
                  <>
                    <div className="flex items-center justify-center h-full flex-col gap-1">
                      <span className="text-sm font-medium">
                        {day}
                      </span>
                      <div className="text-[11px] leading-snug font-medium text-center px-1 h-[32px] overflow-hidden">
                        {entry && inAdventRange && (
                          entry.label
                        )}
                      </div>
                      <div className="text-[11px] leading-snug font-medium text-center px-1 min-h-[14px]">
                        {entry && inAdventRange && entry.author && (
                          'by ' + entry.author
                        )}
                      </div>
                    </div>

                    {/* ホバー時のツールチップ */}
                    {entry && inAdventRange && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white border-2 border-[#444443] rounded-lg shadow-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                        {isFuture ? (
                          // 未来の記事
                          <div className="text-center">
                            <div className="text-sm font-bold text-[#444443] mb-2">
                              {entry.label}
                            </div>
                            {entry.author && (
                              <div className="text-xs font-medium text-gray-900 mb-2">
                                by {entry.author}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 italic">
                              🔒 {formatDateKey(date)}に公開予定
                            </div>
                          </div>
                        ) : (
                          // 公開済みの記事
                          <>
                            <div className="text-sm font-bold text-[#444443] mb-2">
                              {entry.label}
                            </div>
                            {entry.author && (
                              <div className="text-xs font-medium text-gray-900 mb-2">
                                by {entry.author}
                              </div>
                            )}
                            {entry.abstract && (
                              <div className="text-xs text-gray-700 leading-relaxed">
                                {entry.abstract}
                              </div>
                            )}
                          </>
                        )}
                        {/* 吹き出しの三角形 */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#444443]"></div>
                      </div>
                    )}
                  </>
                );

                // 12/1〜25 かつ entry がある日だけリンクにする
                if (entry && inAdventRange) {
                  // 未来の記事はクリック不可
                  if (isFuture) {
                    return (
                      <div key={key} className={`${className} group relative`}>
                        {inner}
                      </div>
                    );
                  }

                  // 外部リンクがある場合はそちらを優先
                  if (entry.externalLink) {
                    return (
                      <a
                        key={key}
                        href={entry.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${className} group relative`}
                      >
                        {inner}
                      </a>
                    );
                  }

                  // // 内部リンク
                  // return (
                  //   <Link
                  //     key={key}
                  //     href={entry.href}
                  //     className={`${className} group relative`}
                  //   >
                  //     {inner}
                  //   </Link>
                  // );
                }

                return (
                  <div key={key} className={className}>
                    {inner}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-zinc-400 text-center">
          ピンクのマスがこのシリーズのアドベント記事の日です。
        </p>
      </main>
      <Footer />
    </>
  );
}
