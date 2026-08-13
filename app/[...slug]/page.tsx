import SitePage from "@/data/neupkishor.com/page";

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <SitePage slug={slug} />;
}
