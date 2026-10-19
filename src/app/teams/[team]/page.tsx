import { notFound } from "next/navigation";
import TeamPage from "@/components/TeamPage/TeamPage";
import { isTeamSlug, type TeamSlug } from "@/data/finishedPosters";
import { TEAM_PAGE_CONTENT, teamPageContent } from "@/data/teamPageContent";

export function generateStaticParams(): { team: TeamSlug }[] {
  return TEAM_PAGE_CONTENT.map((c) => ({ team: c.teamSlug }));
}

type PageProps = {
  params: Promise<{ team: string }>;
};

export default async function TeamIndexPage({ params }: PageProps) {
  const { team } = await params;
  if (!isTeamSlug(team)) notFound();
  const content = teamPageContent(team);
  if (!content) notFound();

  return (
    <TeamPage
      teamName={content.teamName}
      description={content.description}
      loadingVariant={content.loadingVariant}
      fieldSummaryLines={content.fieldSummaryLines}
    />
  );
}
