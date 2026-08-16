import Link from "next/link";
import type { RendererBlogPost, RendererTheme } from "@/services/renderer/_index";

type BlogPostProps = {
  blog: RendererBlogPost;
  theme: RendererTheme;
};

export default function BlogPost({ blog, theme }: BlogPostProps) {
  return (
    <main
      className="min-h-screen bg-[#07171a] px-5 py-8 text-[#f8f1e4] sm:px-8"
      style={{
        backgroundColor: theme.background,
        color: theme.foreground,
      }}
    >
      <article className="mx-auto max-w-4xl">
        <nav className="mb-12 flex items-center justify-between text-sm">
          <Link href="/blog" className="font-semibold hover:text-[#c8a968]">
            Back to blog
          </Link>
          <Link href="/" className="text-[#b8c2bc] hover:text-[#c8a968]">
            Home
          </Link>
        </nav>

        <header className="border-b border-[#c8a968]/25 pb-12">
          <p className="text-sm font-semibold uppercase text-[#c8a968]">
            {blog.category}
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-tight text-[#fff9ed] sm:text-6xl">
            {blog.title}
          </h1>
          <p className="mt-5 text-sm text-[#b8c2bc]">
            {blog.publishedAt} / {blog.readingTime}
          </p>
          <p className="mt-8 text-2xl leading-10 text-[#f8f1e4]">
            {blog.hero}
          </p>
        </header>

        <div className="mt-12 space-y-10">
          {blog.sections.map((section) => (
            <section key={section.title} className="border-l border-[#c8a968] pl-6">
              <h2 className="font-serif text-3xl text-[#fff9ed]">
                {section.title}
              </h2>
              <p className="mt-4 text-lg leading-8 text-[#b8c2bc]">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
