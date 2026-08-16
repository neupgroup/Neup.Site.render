import Link from "next/link";
import type { RendererBlogPost, RendererTheme } from "@/services/renderer/_index";

type BlogIndexProps = {
  blogs: RendererBlogPost[];
  theme: RendererTheme;
};

export default function BlogIndex({ blogs, theme }: BlogIndexProps) {
  return (
    <main
      className="min-h-screen bg-[#07171a] px-5 py-8 text-[#f8f1e4] sm:px-8"
      style={{
        backgroundColor: theme.background,
        color: theme.foreground,
      }}
    >
      <section className="mx-auto max-w-6xl">
        <nav className="mb-12 flex items-center justify-between text-sm">
          <Link href="/" className="font-serif text-lg hover:text-[#c8a968]">
            SAB Legal Service
          </Link>
          <Link href="/our-team" className="text-[#b8c2bc] hover:text-[#c8a968]">
            Our Team
          </Link>
        </nav>

        <header className="grid gap-8 border-b border-[#c8a968]/25 pb-12 lg:grid-cols-[1fr_22rem]">
          <div>
            <p className="text-sm font-semibold uppercase text-[#c8a968]">
              Legal Blog
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-tight text-[#fff9ed] sm:text-6xl">
              Practical legal notes before the next decision.
            </h1>
          </div>
          <p className="self-end text-lg leading-8 text-[#b8c2bc]">
            Guidance on consultation preparation, notices, contracts, documents,
            and dispute decisions for clients in Nepal.
          </p>
        </header>

        <div className="mt-12 grid gap-px border border-[#f8f1e4]/15 bg-[#f8f1e4]/15">
          {blogs.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blog/${blog.slug}`}
              className="group bg-[#10272b] p-6 transition-colors hover:bg-[#143237] sm:p-8"
            >
              <div className="grid gap-5 lg:grid-cols-[1fr_13rem]">
                <div>
                  <p className="text-xs font-semibold uppercase text-[#c8a968]">
                    {blog.category}
                  </p>
                  <h2 className="mt-3 font-serif text-3xl leading-tight text-[#fff9ed] sm:text-4xl">
                    {blog.title}
                  </h2>
                  <p className="mt-5 max-w-3xl leading-7 text-[#b8c2bc]">
                    {blog.description}
                  </p>
                </div>
                <div className="text-sm text-[#b8c2bc] lg:text-right">
                  <p>{blog.publishedAt}</p>
                  <p className="mt-1">{blog.readingTime}</p>
                  <p className="mt-6 font-semibold uppercase text-[#c8a968]">
                    Read article
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
