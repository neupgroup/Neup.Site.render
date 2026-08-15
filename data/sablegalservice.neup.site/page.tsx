import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/data/sablegalservice.neup.site/components/button";
import { getRendererPageContent } from "@/services/renderer/_index";

const domain = "sablegalservice.neup.site";

export default async function SitePage({ slug }: { slug: string[] }) {
  if (slug.length === 0) {
    return <LandingPage />;
  }

  notFound();
}

async function LandingPage() {
  const page = await getRendererPageContent(domain);

  return (
    <main
      className="min-h-screen flex-1 bg-[#07171a] text-[#f8f1e4]"
      style={{
        backgroundColor: page.theme.background,
        color: page.theme.foreground,
      }}
    >
      <section className="relative overflow-hidden border-b border-[#c8a968]/25">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,23,26,0.96),rgba(7,23,26,0.78),rgba(7,23,26,0.54)),url('/favicon.ico')] bg-[length:auto,760px] bg-[position:center,calc(50%+22rem)_center] bg-no-repeat opacity-95" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(248,241,228,0.045)_0,rgba(248,241,228,0.045)_1px,transparent_1px,transparent_92px)]" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between border-b border-[#f8f1e4]/15 pb-5">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center border border-[#c8a968]/45 bg-[#f8f1e4] p-1">
                <img
                  src="/favicon.ico"
                  alt="SAB Legal Service logo"
                  className="h-full w-full object-contain"
                />
              </span>
              <span>
                <span className="block font-serif text-xl leading-none tracking-wide">
                  SAB
                </span>
                <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-[#c8a968]">
                  Legal Service
                </span>
              </span>
            </Link>

            <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5ead5]/80 md:flex">
              {page.navigation.map((item) => (
                <a key={item.href} href={item.href} className="hover:text-[#c8a968]">
                  {item.label}
                </a>
              ))}
            </nav>
          </header>

          <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:py-20">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#c8a968]">
                {page.eyebrow}
              </p>
              <h1 className="mt-6 font-serif text-6xl leading-[0.95] tracking-normal text-[#fff9ed] sm:text-7xl lg:text-8xl">
                {page.heading}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d8ded8] sm:text-xl">
                {page.summary}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button {...page.componentProps.button} />
                <Button {...page.componentProps.secondaryButton} />
              </div>
            </div>

            <aside className="border-l border-[#c8a968]/35 pl-6">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#c8a968]">
                Counsel Note
              </p>
              <p className="mt-5 font-serif text-3xl leading-tight text-[#fff9ed]">
                Law is most useful when it is clear before it becomes urgent.
              </p>
              <div className="mt-8 grid gap-4">
                {page.stats.map((stat) => (
                  <div key={stat.label} className="border-t border-[#f8f1e4]/15 pt-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#b8c2bc]">
                      {stat.label}
                    </p>
                    <p className="mt-1 font-serif text-2xl text-[#f8f1e4]">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="grid gap-3 pb-8 md:grid-cols-4">
            {page.highlights.map((highlight) => (
              <p
                key={highlight}
                className="border-t border-[#c8a968]/35 pt-4 text-sm leading-6 text-[#d8ded8]"
              >
                {highlight}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="practice" className="border-b border-[#c8a968]/20 bg-[#f8f1e4] text-[#07171a]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#946f2c]">
              Practice Areas
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-normal sm:text-5xl">
              Legal support shaped around facts, documents, and outcomes.
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden border border-[#07171a]/15 bg-[#07171a]/15 md:grid-cols-2">
            {page.services.map((service) => (
              <article key={service.title} className="bg-[#f8f1e4] p-7">
                <h3 className="font-serif text-2xl tracking-normal">
                  {service.title}
                </h3>
                <p className="mt-4 leading-7 text-[#425254]">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="approach" className="border-b border-[#c8a968]/20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c8a968]">
              Approach
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-normal sm:text-5xl">
              Calm process for serious legal decisions.
            </h2>
          </div>
          <div className="grid gap-6">
            {page.process.map((step, index) => (
              <div key={step} className="grid gap-5 border-t border-[#f8f1e4]/15 pt-6 sm:grid-cols-[5rem_1fr]">
                <p className="font-serif text-4xl text-[#c8a968]">
                  0{index + 1}
                </p>
                <p className="text-lg leading-8 text-[#d8ded8]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="counsel" className="bg-[#10272b]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-3 lg:px-10">
          <div className="lg:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c8a968]">
              Counsel
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-normal">
              Built on preparation and discretion.
            </h2>
          </div>
          <div className="grid gap-px border border-[#f8f1e4]/15 bg-[#f8f1e4]/15 lg:col-span-2">
            {page.proof.map((item) => (
              <p key={item} className="bg-[#10272b] p-6 text-lg leading-8 text-[#d8ded8]">
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="border-t border-[#c8a968]/25">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
          <div>
            <p className="font-serif text-3xl text-[#fff9ed]">
              {page.profile.name}
            </p>
            <p className="mt-3 max-w-xl leading-7 text-[#b8c2bc]">
              {page.profile.tagline}
            </p>
          </div>
          <div className="text-sm text-[#d8ded8] lg:text-right">
            <p>{page.profile.location}</p>
            <a className="mt-2 block text-[#c8a968] hover:text-[#f3d58d]" href={`mailto:${page.profile.email}`}>
              {page.profile.email}
            </a>
          </div>
        </div>

        {page.warnings.length > 0 ? (
          <div className="mx-auto mb-10 max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
              <p className="font-semibold">Renderer data warning</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {page.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </footer>
    </main>
  );
}
