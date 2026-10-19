import { redirect } from "next/navigation";
import { isTeamSlug } from "@/data/finishedPosters";
import {
  teamPdfPagePath,
  teamPostersLegacyStaticParams,
} from "@/data/teamPdfPages";
import { decodeSlideSlugParam } from "@/utils/normalizeSlideSlug";

export function generateStaticParams() {
  return teamPostersLegacyStaticParams();
}

type PageProps = {
  params: Promise<{ team: string; slug: string }>;
};

/** 旧 URL `/teams/.../posters/...` → `/teams/.../pdf/...` */
export default async function LegacyPostersRedirect({ params }: PageProps) {
  const { team, slug: slugRaw } = await params;
  if (!isTeamSlug(team)) redirect("/");
  redirect(teamPdfPagePath(team, decodeSlideSlugParam(slugRaw)));
}
