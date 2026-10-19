import { notFound } from "next/navigation";
import PosterPdfPage from "@/components/PosterPdfPage/PosterPdfPage";
import { isTeamSlug } from "@/data/finishedPosters";
import {
  resolveTeamPdfPage,
  TEAM_SLUG_TO_DISPLAY_NAME,
  teamPdfStaticParams,
} from "@/data/teamPdfPages";
import { decodeSlideSlugParam } from "@/utils/normalizeSlideSlug";

export function generateStaticParams() {
  return teamPdfStaticParams();
}

type PageProps = {
  params: Promise<{ team: string; slug: string }>;
};

export default async function TeamPdfPage({ params }: PageProps) {
  const { team, slug: slugRaw } = await params;
  const slug = decodeSlideSlugParam(slugRaw);
  if (!isTeamSlug(team)) notFound();

  const poster = resolveTeamPdfPage(team, slug);
  if (!poster) notFound();

  return (
    <PosterPdfPage
      poster={poster}
      teamName={TEAM_SLUG_TO_DISPLAY_NAME[team]}
    />
  );
}
