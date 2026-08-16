import Link from "next/link";
import { notFound } from "next/navigation";
import BlogPostPage from "@/data/sablegalservice.neup.site/app/blog/[slug]/page";
import BlogPage from "@/data/sablegalservice.neup.site/app/blog/page";
import OurTeamPage from "@/data/sablegalservice.neup.site/app/our-team/page";
import Button from "@/data/sablegalservice.neup.site/components/button";
import { getRendererPageContent } from "@/services/renderer/_index";

const domain = "sablegalservice.neup.site";

export default async function SitePage({ slug }: { slug: string[] }) {
  if (slug.length === 0) {
    return <LandingPage />;
  }

  if (slug.length === 1 && (slug[0] === "blog" || slug[0] === "blogs")) {
    return <BlogPage />;
  }

  if (slug.length === 2 && (slug[0] === "blog" || slug[0] === "blogs")) {
    return <BlogPostPage slug={slug[1]} />;
  }

  if (slug.length === 1 && (slug[0] === "our-team" || slug[0] === "team")) {
    return <OurTeamPage />;
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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,23,26,0.98),rgba(7,23,26,0.86),rgba(24,46,49,0.68)),url('/assets/logo.png')] bg-[length:auto,560px] bg-[position:center,calc(50%+22rem)_center] bg-no-repeat opacity-95" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(248,241,228,0.04)_0,rgba(248,241,228,0.04)_1px,transparent_1px,transparent_92px)]" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
          <header className="flex flex-col gap-5 border-b border-[#f8f1e4]/15 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center border border-[#c8a968]/45 bg-[#f8f1e4] p-1">
                <img
                  src="/favicon.ico"
                  alt="SAB Legal Service logo"
                  className="h-full w-full object-contain"
                />
              </span>
              <span>
                <span className="block font-serif text-xl leading-none">
                  SAB
                </span>
                <span className="block text-xs font-semibold uppercase text-[#c8a968]">
                  Legal Service
                </span>
              </span>
            </Link>

            <nav className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-semibold uppercase text-[#f5ead5]/80">
              {page.navigation.map((item) => (
                <a key={item.href} href={item.href} className="hover:text-[#c8a968]">
                  {item.label}
                </a>
              ))}
            </nav>
          </header>

          <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_24rem] lg:py-20">
            <div className="max-w-4xl">
              <p className="text-sm font-semibold uppercase text-[#c8a968]">
                {page.eyebrow}
              </p>
              <h1 className="mt-6 font-serif text-5xl leading-none text-[#fff9ed] sm:text-7xl lg:text-8xl">
                {page.heading}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d8ded8] sm:text-xl">
                {page.summary}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button {...page.componentProps.button} />
                <Button {...page.componentProps.secondaryButton} />
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#d8ded8]">
                <a className="text-[#c8a968] hover:text-[#f3d58d]" href={`mailto:${page.profile.email}`}>
                  {page.profile.email}
                </a>
                <a className="text-[#c8a968] hover:text-[#f3d58d]" href={`tel:${page.profile.phone.replace(/[^+\d]/g, "")}`}>
                  {page.profile.phone}
                </a>
              </div>
            </div>

            <aside className="border-l border-[#c8a968]/35 bg-[#07171a]/55 p-6">
              <p className="text-xs font-semibold uppercase text-[#c8a968]">
                Before you decide
              </p>
              <p className="mt-5 font-serif text-3xl leading-tight text-[#fff9ed]">
                Speak with counsel before signing, replying, filing, or ignoring a deadline.
              </p>
              <div className="mt-8 grid gap-4">
                {page.stats.map((stat) => (
                  <div key={stat.label} className="border-t border-[#f8f1e4]/15 pt-4">
                    <p className="text-xs uppercase text-[#b8c2bc]">
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
          <div className="grid gap-8 lg:grid-cols-[1fr_26rem]">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase text-[#946f2c]">
                Practice Areas
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Legal help for the problems people actually call about.
              </h2>
            </div>
            <div className="border border-[#07171a]/15 bg-white p-6">
              <p className="font-serif text-2xl">Need a fast first review?</p>
              <p className="mt-3 leading-7 text-[#425254]">
                Share the matter, documents, and deadline. SAB will confirm the consultation path before work begins.
              </p>
              <a
                className="mt-5 inline-flex bg-[#07171a] px-5 py-3 text-sm font-semibold uppercase text-[#f8f1e4] hover:bg-[#173438]"
                href="#contact"
              >
                Request consultation
              </a>
            </div>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden border border-[#07171a]/15 bg-[#07171a]/15 md:grid-cols-2">
            {page.services.map((service) => (
              <article key={service.title} className="bg-[#f8f1e4] p-7">
                <h3 className="font-serif text-2xl">
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

      <section id="services" className="border-b border-[#c8a968]/20 bg-[#fff9ed] text-[#07171a]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[#946f2c]">
              Service fit
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Choose the route that matches the risk in front of you.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {page.sales.serviceDetails.map((service) => (
              <article key={service.title} className="border border-[#07171a]/15 bg-[#f8f1e4] p-6">
                <h3 className="font-serif text-2xl">{service.title}</h3>
                <p className="mt-4 leading-7 text-[#425254]">{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="border-b border-[#c8a968]/20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase text-[#c8a968]">
              Trust
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Clear identity, confidential handling, and visible professional signals.
            </h2>
          </div>
          <div className="grid gap-5">
            <div className="grid gap-px border border-[#f8f1e4]/15 bg-[#f8f1e4]/15 sm:grid-cols-3">
              {page.sales.credentials.map((credential) => (
                <div key={credential.label} className="bg-[#10272b] p-5">
                  <p className="text-xs font-semibold uppercase text-[#c8a968]">
                    {credential.label}
                  </p>
                  <p className="mt-3 leading-7 text-[#f8f1e4]">{credential.detail}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-px border border-[#f8f1e4]/15 bg-[#f8f1e4]/15">
              {page.proof.map((item) => (
                <p key={item} className="bg-[#10272b] p-5 text-lg leading-8 text-[#d8ded8]">
                  {item}
                </p>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {page.sales.trustLogos.map((logo) => (
                <span key={logo} className="border border-[#c8a968]/35 px-4 py-3 text-sm text-[#f8f1e4]">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="approach" className="border-b border-[#c8a968]/20 bg-[#f8f1e4] text-[#07171a]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase text-[#946f2c]">
              Approach
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              A calm process for serious legal decisions.
            </h2>
          </div>
          <div className="grid gap-6">
            {page.process.map((step, index) => (
              <div key={step} className="grid gap-5 border-t border-[#07171a]/15 pt-6 sm:grid-cols-[5rem_1fr]">
                <p className="font-serif text-4xl text-[#946f2c]">
                  0{index + 1}
                </p>
                <p className="text-lg leading-8 text-[#425254]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fees" className="border-b border-[#c8a968]/20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase text-[#c8a968]">
              Consultation
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Know what to bring and what happens next.
            </h2>
          </div>
          <div className="grid gap-5">
            <div className="border border-[#c8a968]/35 p-6">
              <p className="font-serif text-2xl text-[#fff9ed]">Consultation fee</p>
              <p className="mt-3 leading-7 text-[#d8ded8]">
                Sample consultation policy: fee, duration, and scope are confirmed before the appointment.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {page.sales.documents.map((document) => (
                <p key={document} className="border-t border-[#f8f1e4]/15 pt-4 leading-7 text-[#d8ded8]">
                  {document}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#c8a968]/20 bg-[#fff9ed] text-[#07171a]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[#946f2c]">
              Client proof
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Client feedback, shown here with sample review data until verified testimonials are added.
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {page.sales.testimonials.map((testimonial) => (
              <article key={`${testimonial.name}-${testimonial.role}`} className="border border-[#07171a]/15 bg-[#f8f1e4] p-6">
                <p className="leading-7 text-[#425254]">{testimonial.quote}</p>
                <p className="mt-6 font-serif text-xl">{testimonial.name}</p>
                <p className="mt-1 text-sm text-[#5f6f71]">{testimonial.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#c8a968]/20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase text-[#c8a968]">
              Questions
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              Answers that reduce hesitation before a consultation.
            </h2>
          </div>
          <div className="grid gap-px border border-[#f8f1e4]/15 bg-[#f8f1e4]/15">
            {page.sales.faqs.map((faq) => (
              <article key={faq.question} className="bg-[#10272b] p-6">
                <h3 className="font-serif text-2xl text-[#fff9ed]">{faq.question}</h3>
                <p className="mt-3 leading-7 text-[#d8ded8]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="border-t border-[#c8a968]/25">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase text-[#c8a968]">Contact</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-[#fff9ed] sm:text-5xl">
              Request a private consultation.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-[#b8c2bc]">
              {page.profile.tagline}
            </p>
            <div className="mt-8 grid gap-3">
              {page.sales.contactMethods.map((method) => (
                <a
                  key={method.label}
                  className="border border-[#c8a968]/35 p-4 text-[#d8ded8] hover:border-[#f3d58d]"
                  href={method.href}
                >
                  <span className="block text-xs font-semibold uppercase text-[#c8a968]">
                    {method.label}
                  </span>
                  <span className="mt-1 block">{method.value}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="border border-[#c8a968]/35 bg-[#10272b] p-6">
            <form action={`mailto:${page.profile.email}`} method="post" encType="text/plain" className="grid gap-4">
              <label className="grid gap-2 text-sm text-[#d8ded8]">
                Name
                <input name="name" className="min-h-12 border border-[#f8f1e4]/20 bg-[#07171a] px-4 text-[#f8f1e4]" placeholder="Your name" />
              </label>
              <label className="grid gap-2 text-sm text-[#d8ded8]">
                Phone or email
                <input name="contact" className="min-h-12 border border-[#f8f1e4]/20 bg-[#07171a] px-4 text-[#f8f1e4]" placeholder="How should SAB contact you?" />
              </label>
              <label className="grid gap-2 text-sm text-[#d8ded8]">
                Matter type
                <select name="matter" className="min-h-12 border border-[#f8f1e4]/20 bg-[#07171a] px-4 text-[#f8f1e4]">
                  <option>Property or civil dispute</option>
                  <option>Business or company matter</option>
                  <option>Family or personal documentation</option>
                  <option>Contract, notice, or filing</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm text-[#d8ded8]">
                Short summary
                <textarea name="summary" className="min-h-32 border border-[#f8f1e4]/20 bg-[#07171a] px-4 py-3 text-[#f8f1e4]" placeholder="Briefly describe the issue, deadline, and documents available." />
              </label>
              <button className="min-h-12 bg-[#c8a968] px-5 py-3 text-sm font-semibold uppercase text-[#07171a] hover:bg-[#f3d58d]" type="submit">
                Send request
              </button>
            </form>
            <div className="mt-6 border-t border-[#f8f1e4]/15 pt-5 text-sm leading-7 text-[#b8c2bc]">
              <p>{page.profile.name}</p>
              <p>{page.profile.address}</p>
              <p>{page.profile.location}</p>
              <a className="text-[#c8a968] hover:text-[#f3d58d]" href={`mailto:${page.profile.email}`}>
                {page.profile.email}
              </a>
            </div>
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
