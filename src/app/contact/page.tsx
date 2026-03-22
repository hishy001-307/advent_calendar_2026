import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const PAST_YEARS = [
  "2024年度",
  "2023年度",
  "2022年度",
  "2021年度",
  "2020年度",
  "2019年度",
  "2018年度",
  "2017年度",
  "2016年度",
  "2015年度",
  "2014年度",
  "2013年度",
  "2012年度",
  "2011年度",
  "2010年度",
];

const MAP_EMBED_URL =
  "https://www.google.com/maps?q=%E6%9D%B1%E4%BA%AC%E5%A4%A7%E5%AD%A6%E7%90%86%E5%AD%A6%E9%83%A8%E4%B8%80%E5%8F%B7%E9%A4%A8&output=embed";
const MAP_LINK_URL =
  "https://www.google.com/maps?sca_esv=ea0bf85f729d5e5e&rlz=1C5OZZY_enJP1167JP1167&output=search&q=%E6%9D%B1%E4%BA%AC%E5%A4%A7%E5%AD%A6%E7%90%86%E5%AD%A6%E9%83%A8%E4%B8%80%E5%8F%B7%E9%A4%A8+google+map&source=lnms&fbs=ADc_l-ZlCIK_ae5oKZcV5pK93vZHTNGrC6L2JcwF5fruDO_Pmjr5z1wvp84rqzq5-Lv6m-tIxXaZpHp8xRMMmtiilPjSIHh0hZ_Y1U2iLKtZikjO3cfiCxjgKFewJ0Qwp9OeEJWBdkDYFSibOSVae9IZuqWjU6OoX47YufLh6Wz4lTvW1k89a9izL--0uLV2xbclzQxL1iXVB2RD3Q64PKjQCt-9yc4Eab99oRA3bpZV_zgAKwVC9Uk&entry=mc&ved=1t:200715&ictx=111";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 pt-8 pb-8 space-y-6">
        <header className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Contact
          </p>
          <h1 className="text-4xl font-semibold text-[#444443]">お問い合わせ</h1>
        </header>

        <section className="rounded-xl border border-[#f0e4c8] bg-[#fffdf7] p-8 shadow-[0_12px_24px_rgba(0,0,0,0.06)] space-y-3">
          <p className="text-zinc-700">
            Physics Lab. 2026 公式X:{" "}
            <a
              href="https://x.com/physicslab2026"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#983c3d] underline underline-offset-4"
            >
              @physicslab2026
            </a>
          </p>
          <p className="text-zinc-700">
            Physics Lab. 2026 公式Instagram:{" "}
            <a
              href="https://www.instagram.com/physlab2026/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#983c3d] underline underline-offset-4"
            >
              @physlab2026
            </a>
          </p>
          <p className="text-zinc-700">Mail: physlab2026[at]gmail.com</p>
        </section>

        <section className="rounded-xl border border-[#f0e4c8] bg-[#fffdf7] p-8 shadow-[0_12px_24px_rgba(0,0,0,0.06)] space-y-4">
          <h2 className="text-2xl font-semibold text-[#444443]">過去のPhysics Lab.</h2>
          <ul className="grid gap-1 text-zinc-700 sm:grid-cols-2">
            {PAST_YEARS.map((year) => (
              <li key={year}>{year}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-[#f0e4c8] bg-[#fffdf7] p-8 shadow-[0_12px_24px_rgba(0,0,0,0.06)] space-y-2">
          <h2 className="text-2xl font-semibold text-[#444443]">外部リンク</h2>
          <a
            href="https://www.s.u-tokyo.ac.jp/ja/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#983c3d] underline underline-offset-4"
          >
            東京大学理学部物理学科
          </a>
        </section>

        <section className="rounded-xl border border-[#f0e4c8] bg-[#fffdf7] p-8 shadow-[0_12px_24px_rgba(0,0,0,0.06)] space-y-3">
          <h2 className="text-2xl font-semibold text-[#444443]">会場までの地図</h2>
          <div className="overflow-hidden rounded-lg border border-zinc-200">
            <iframe
              src={MAP_EMBED_URL}
              width="100%"
              height="360"
              style={{ border: 0 }}
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
