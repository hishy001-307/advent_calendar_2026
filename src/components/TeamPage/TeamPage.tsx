import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

type TeamPageProps = {
  teamName: string;
  description: string;
};

export default function TeamPage({ teamName, description }: TeamPageProps) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 pt-8 pb-8 space-y-6">
        <header className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Physics Lab. 2026
          </p>
          <h1 className="text-4xl font-semibold text-[#444443]">{teamName}</h1>
          <p className="text-sm text-zinc-600">{description}</p>
        </header>

        <section className="rounded-xl border border-[#f0e4c8] bg-[#fffdf7] p-8 shadow-[0_12px_24px_rgba(0,0,0,0.06)]">
          <p className="text-center text-zinc-500">
            このページは準備中です。コンテンツは順次公開します。
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
