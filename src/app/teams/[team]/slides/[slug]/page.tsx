import { redirect } from "next/navigation";
import { isTeamSlug } from "@/data/finishedPosters";
import {
  teamPdfPagePath,
  teamSlidesLegacyStaticParams,
} from "@/data/teamPdfPages";
import { decodeSlideSlugParam } from "@/utils/normalizeSlideSlug";

export function generateStaticParams() {
  return teamSlidesLegacyStaticParams();
}

type PageProps = {
  params: Promise<{ team: string; slug: string }>;
};

/** 旧 URL `/teams/.../slides/...` → `/teams/.../pdf/...` */
export default async function LegacySlidesRedirect({ params }: PageProps) {
  const { team, slug: slugRaw } = await params;
  const slug = decodeSlideSlugParam(slugRaw);
  if (!isTeamSlug(team)) redirect("/");
  redirect(teamPdfPagePath(team, slug));
}
