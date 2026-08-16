import BlogIndex from "@/data/sablegalservice.neup.site/components/blog/blogIndex";
import { getRendererBlogsContent } from "@/services/renderer/_index";

const domain = "sablegalservice.neup.site";

export default async function BlogPage() {
  const page = await getRendererBlogsContent(domain);

  return <BlogIndex blogs={page.blogs} theme={page.theme} />;
}
