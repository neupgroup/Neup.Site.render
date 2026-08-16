import { notFound } from "next/navigation";
import BlogPost from "@/data/sablegalservice.neup.site/components/blog/blogPost";
import { getRendererBlogPostContent } from "@/services/renderer/_index";

const domain = "sablegalservice.neup.site";

export default async function BlogPostPage({ slug }: { slug: string }) {
  const page = await getRendererBlogPostContent(domain, slug);

  if (!page.blog) {
    notFound();
  }

  return <BlogPost blog={page.blog} theme={page.theme} />;
}
