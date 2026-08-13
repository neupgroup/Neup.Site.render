import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/data/neupkishor.com/components/button";
import {
  getRendererBlogPostContent,
  getRendererBlogsContent,
  getRendererPageContent,
} from "@/services/renderer/_index";

const domain = "neupkishor.com";

export default async function SitePage({ slug }: { slug: string[] }) {
  if (slug.length === 0) {
    return <LandingPage />;
  }

  if (slug.length === 1 && slug[0] === "blogs") {
    return <BlogsIndex />;
  }

  if (slug.length === 2 && slug[0] === "blogs") {
    return <BlogPost slug={slug[1]} />;
  }

  notFound();
}

async function LandingPage() {
  const page = await getRendererPageContent(domain);

  return (
    <main
      className="min-h-screen flex-1 overflow-hidden px-5 py-6 sm:px-8"
      style={{
        backgroundColor: page.theme.background,
        color: page.theme.foreground,
      }}
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(232,89,42,0.22),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(255,247,237,0.10),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:auto,auto,36px_36px]" />

      <section className="relative mx-auto max-w-7xl">
        <header className="flex items-center justify-between rounded-full border border-stone-700/70 bg-stone-950/45 px-5 py-3 backdrop-blur">
          <a href="#" className="flex items-center gap-3">
            <span
              className="grid h-9 w-9 place-items-center rounded-full text-sm font-black text-stone-950"
              style={{ backgroundColor: page.theme.accent }}
            >
              NK
            </span>
            <span>
              <span className="block text-sm font-semibold">
                {page.profile.name}
              </span>
              <span className="block text-xs" style={{ color: page.theme.muted }}>
                {page.profile.role}
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-stone-300 md:flex">
            {page.navigation.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        <section className="grid min-h-[78vh] items-center gap-10 py-16 lg:grid-cols-[1.12fr_0.88fr] lg:py-24">
          <div>
            <p
              className="mb-5 text-sm font-semibold uppercase tracking-[0.36em]"
              style={{ color: page.theme.accent }}
            >
              {page.eyebrow}
            </p>
            <h1 className="max-w-5xl text-5xl font-black tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              {page.heading}
            </h1>
            <p
              className="mt-7 max-w-2xl text-lg leading-8 sm:text-xl"
              style={{ color: page.theme.muted }}
            >
              {page.summary}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button {...page.componentProps.button} />
              <Button {...page.componentProps.secondaryButton} />
            </div>
          </div>

          <aside
            className="relative rounded-[2rem] border p-6 shadow-2xl"
            style={{
              backgroundColor: page.theme.surface,
              borderColor: page.theme.accent,
            }}
          >
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-orange-600/30 blur-2xl" />
            <p className="text-sm uppercase tracking-[0.28em] text-stone-400">
              Personal brand
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight">
              {page.profile.name}
            </h2>
            <p className="mt-3 leading-7" style={{ color: page.theme.muted }}>
              {page.profile.tagline}
            </p>
            <div className="mt-7 grid gap-3">
              {page.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl border border-stone-700/70 bg-stone-950/35 p-4 text-sm"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-3 border-y border-stone-800 py-7 md:grid-cols-3">
          {page.stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-sm" style={{ color: page.theme.muted }}>
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-black tracking-tight">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        <section id="offer" className="py-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-[0.3em]"
                style={{ color: page.theme.accent }}
              >
                Offer
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">
                What I build
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {page.services.map((service) => (
              <article
                key={service.title}
                className="rounded-[1.5rem] border border-stone-800 bg-stone-950/35 p-6"
              >
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p
                  className="mt-4 leading-7"
                  style={{ color: page.theme.muted }}
                >
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="proof"
          className="grid gap-6 rounded-[2rem] border border-stone-800 p-6 md:grid-cols-2 md:p-10"
          style={{ backgroundColor: page.theme.surface }}
        >
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-[0.3em]"
              style={{ color: page.theme.accent }}
            >
              Proof
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight">
              Built for teams that need judgment, not just output.
            </h2>
          </div>
          <div className="space-y-4">
            {page.proof.map((item) => (
              <p key={item} className="rounded-2xl bg-stone-950/40 p-4">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section id="process" className="py-20">
          <p
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{ color: page.theme.accent }}
          >
            Process
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {page.process.map((step, index) => (
              <div key={step} className="rounded-[1.5rem] bg-stone-950/40 p-6">
                <p className="text-sm" style={{ color: page.theme.accent }}>
                  0{index + 1}
                </p>
                <p className="mt-4 text-lg font-semibold leading-7">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-col gap-5 border-t border-stone-800 py-8 md:flex-row md:items-center md:justify-between">
          <p style={{ color: page.theme.muted }}>
            Based in {page.profile.location}. Reach me at{" "}
            <a className="text-stone-100" href={`mailto:${page.profile.email}`}>
              {page.profile.email}
            </a>
            .
          </p>
          <div className="flex gap-4 text-sm">
            {page.profile.socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                className="text-stone-300 hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </footer>

        {page.warnings.length > 0 ? (
          <div className="mt-10 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-semibold">Renderer data warning</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {page.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </main>
  );
}

async function BlogsIndex() {
  const page = await getRendererBlogsContent(domain);

  return (
    <main
      className="min-h-screen px-5 py-8 sm:px-8"
      style={{
        backgroundColor: page.theme.background,
        color: page.theme.foreground,
      }}
    >
      <section className="mx-auto max-w-6xl">
        <nav className="mb-12 flex items-center justify-between text-sm">
          <Link href="/" className="font-semibold hover:opacity-80">
            Neup Kishor
          </Link>
          <Link href="/" style={{ color: page.theme.muted }}>
            Back home
          </Link>
        </nav>

        <header className="max-w-3xl">
          <p
            className="text-sm font-semibold uppercase tracking-[0.34em]"
            style={{ color: page.theme.accent }}
          >
            Field Notes
          </p>
          <h1 className="mt-5 text-5xl font-black tracking-[-0.05em] sm:text-7xl">
            Practical writing on product engineering.
          </h1>
          <p
            className="mt-6 text-lg leading-8"
            style={{ color: page.theme.muted }}
          >
            Notes on building software that ships, survives change, and stays
            understandable after the first version.
          </p>
        </header>

        <div className="mt-14 grid gap-5">
          {page.blogs.map((blog) => (
            <Link
              key={blog.slug}
              href={`/blogs/${blog.slug}`}
              className="group rounded-[1.5rem] border border-stone-800 bg-stone-950/35 p-6 transition-colors hover:border-orange-600"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p
                    className="text-sm font-semibold uppercase tracking-[0.24em]"
                    style={{ color: page.theme.accent }}
                  >
                    {blog.category}
                  </p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight">
                    {blog.title}
                  </h2>
                </div>
                <p className="text-sm" style={{ color: page.theme.muted }}>
                  {blog.publishedAt} · {blog.readingTime}
                </p>
              </div>
              <p
                className="mt-5 max-w-3xl leading-7"
                style={{ color: page.theme.muted }}
              >
                {blog.description}
              </p>
              <p className="mt-6 text-sm font-semibold text-stone-100">
                Read note{" "}
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

async function BlogPost({ slug }: { slug: string }) {
  const page = await getRendererBlogPostContent(domain, slug);

  if (!page.blog) {
    notFound();
  }

  return (
    <main
      className="min-h-screen px-5 py-8 sm:px-8"
      style={{
        backgroundColor: page.theme.background,
        color: page.theme.foreground,
      }}
    >
      <article className="mx-auto max-w-4xl">
        <nav className="mb-12 flex items-center justify-between text-sm">
          <Link href="/blogs" className="font-semibold hover:opacity-80">
            Back to writing
          </Link>
          <Link href="/" style={{ color: page.theme.muted }}>
            Home
          </Link>
        </nav>

        <header>
          <p
            className="text-sm font-semibold uppercase tracking-[0.34em]"
            style={{ color: page.theme.accent }}
          >
            {page.blog.category}
          </p>
          <h1 className="mt-5 text-5xl font-black tracking-[-0.05em] sm:text-7xl">
            {page.blog.title}
          </h1>
          <p className="mt-5 text-sm" style={{ color: page.theme.muted }}>
            {page.blog.publishedAt} · {page.blog.readingTime}
          </p>
          <p className="mt-8 text-2xl font-semibold leading-10">
            {page.blog.hero}
          </p>
        </header>

        <div className="mt-14 space-y-10">
          {page.blog.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[1.5rem] border border-stone-800 bg-stone-950/35 p-6"
            >
              <h2 className="text-2xl font-black tracking-tight">
                {section.title}
              </h2>
              <p
                className="mt-4 text-lg leading-8"
                style={{ color: page.theme.muted }}
              >
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
