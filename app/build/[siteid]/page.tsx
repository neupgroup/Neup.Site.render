/*
::neup.documentation::build-siteid-page

::public

Server-rendered wrapper for `/build/[siteid]`. It resolves the route params and
passes the site id into the interactive client UI.

::public end

::end
*/
import BuildSitePageClient from "./BuildSitePageClient";

export default async function BuildSitePage(props: PageProps<"/build/[siteid]">) {
  const { siteid: siteId } = await props.params;
  return <BuildSitePageClient siteId={siteId} />;
}
