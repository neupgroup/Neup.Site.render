import TeamIndex from "@/data/sablegalservice.neup.site/components/team/teamIndex";
import { getRendererTeamContent } from "@/services/renderer/_index";

const domain = "sablegalservice.neup.site";

export default async function OurTeamPage() {
  const page = await getRendererTeamContent(domain);

  return <TeamIndex team={page.team} theme={page.theme} />;
}
