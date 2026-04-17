import Link from "next/link";
import Header from "@/components/Header/Header";
import About from "@/components/About/About";
import Footer from "@/components/Footer/Footer";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./Home.module.scss";

const TEAMS = [
  { name: "素粒子物理班", href: "/teams/particle" },
  { name: "物性物理班", href: "/teams/condensed-matter" },
  { name: "宇宙物理班", href: "/teams/astrophysics" },
  { name: "計算・数理物理班", href: "/teams/computational-math" },
  { name: "生物物理班", href: "/teams/biophysics" },
  { name: "実験班", href: "/teams/experimental" },
];

const MAP_EMBED_URL =
  "https://www.google.com/maps?q=%E6%9D%B1%E4%BA%AC%E5%A4%A7%E5%AD%A6%E7%90%86%E5%AD%A6%E9%83%A8%E4%B8%80%E5%8F%B7%E9%A4%A8&output=embed";
const MAP_LINK_URL =
  "https://www.google.com/maps?sca_esv=ea0bf85f729d5e5e&rlz=1C5OZZY_enJP1167JP1167&output=search&q=%E6%9D%B1%E4%BA%AC%E5%A4%A7%E5%AD%A6%E7%90%86%E5%AD%A6%E9%83%A8%E4%B8%80%E5%8F%B7%E9%A4%A8+google+map&source=lnms&fbs=ADc_l-ZlCIK_ae5oKZcV5pK93vZHTNGrC6L2JcwF5fruDO_Pmjr5z1wvp84rqzq5-Lv6m-tIxXaZpHp8xRMMmtiilPjSIHh0hZ_Y1U2iLKtZikjO3cfiCxjgKFewJ0Qwp9OeEJWBdkDYFSibOSVae9IZuqWjU6OoX47YufLh6Wz4lTvW1k89a9izL--0uLV2xbclzQxL1iXVB2RD3Q64PKjQCt-9yc4Eab99oRA3bpZV_zgAKwVC9Uk&entry=mc&ved=1t:200715&ictx=111";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl min-w-0 px-3 pt-6 pb-8 space-y-6 min-[480px]:px-4 min-[480px]:pt-8 min-[480px]:space-y-8">
        <section className={styles.hero}>
          <div className={styles.orbOne} />
          <div className={styles.orbTwo} />
          <div className={styles.orbThree} />

          <p className={styles.eyebrow}>Physics Lab. 2026</p>
          <h1 className={styles.title}>Welcome to Physics Lab.</h1>
          <p className={styles.description}>
            物理をもっと面白く、もっと身近に。各班ページやお問い合わせから、
            私たちの活動をぜひ覗いてみてください。
          </p>

          <div className={styles.actions}>
            <Link href="/teams/particle" className={styles.primaryButton} prefetch={false}>
              班紹介を見る
            </Link>
            <Link href="/contact" className={styles.secondaryButton}>
              お問い合わせ（Contact）
            </Link>
          </div>
        </section>

        <ScrollReveal
          className={styles.revealFromLeft}
          visibleClassName={styles.revealed}
        >
          <About />
        </ScrollReveal>

        <ScrollReveal
          className={`${styles.teamSection} ${styles.revealFromLeft}`}
          visibleClassName={styles.revealed}
        >
          <header className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Teams
            </p>
            <h2 className="text-2xl font-semibold text-[#444443] min-[480px]:text-3xl">班紹介</h2>
          </header>

          <div className={styles.teamGrid}>
            {TEAMS.map((team) => (
              <div key={team.href} className={styles.teamCard}>
                <Link href={team.href} className={styles.teamCardLink} prefetch={false}>
                  {team.name}
                </Link>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal
          className={`${styles.noticeCard} ${styles.revealFromLeft}`}
          visibleClassName={styles.revealed}
        >
          <p className={styles.noticeLabel}>お知らせ</p>
          <h2 className={styles.noticeTitle}>五月祭総選挙について</h2>
          <p className={styles.noticeText}>
            五月祭では、来場者の投票と評価を総合的に判断して人気企画を決定する
            「五月祭総選挙」を実施しています。
          </p>
          <p className={styles.noticeText}>
            投票は、指定の投票場所もしくは第 98 回五月祭 HP の企画詳細ページの
            「企画紹介」欄から行うことができます。
          </p>
          <p className={styles.noticeText}>本企画への投票をよろしくお願いいたします！</p>
{/* 
          <div className={styles.noticeSchedule}>
            <h3 className={styles.noticeSubTitle}>投票期間</h3>
            <p className={styles.noticeText}>オンライン投票の場合:</p>
            <p className={styles.noticeTime}>5月24日（土）9:00～5月25日（日）16:00</p>
            <p className={styles.noticeText}>現地投票の場合:</p>
            <p className={styles.noticeTime}>5月24日（土）9:00～18:00</p>
            <p className={styles.noticeTime}>5月25日（日）9:00～16:00</p>
          </div> */}

          <div className={styles.noticeLinks}>
            <a
              href="https://gogatsusai.jp/98/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.noticeLink}
            >
              五月祭公式 Web サイトでの投票はこちら
            </a>
            {/* <a
              href="https://gogatsusai.jp/98/visitor/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.noticeLink}
            >
              現地投票の場所はこちら
            </a> */}
          </div>
        </ScrollReveal>

        <section className="rounded-xl border border-[#f0e4c8] bg-[#fffdf7] p-4 shadow-[0_12px_24px_rgba(0,0,0,0.06)] space-y-3 sm:p-8">
          <h2 className="text-xl font-semibold text-[#444443] min-[480px]:text-2xl">会場までの地図</h2>
          <div className="overflow-hidden rounded-lg border border-zinc-200">
            <iframe
              src={MAP_EMBED_URL}
              width="100%"
              className="block h-[220px] w-full border-0 sm:h-[360px]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="会場までの地図"
            />
          </div>
          <a
            href={MAP_LINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#983c3d] underline underline-offset-4"
          >
            Google マップで開く
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
