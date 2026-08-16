import Link from "next/link";
import type { RendererTeamMember, RendererTheme } from "@/services/renderer/_index";

type TeamIndexProps = {
  team: RendererTeamMember[];
  theme: RendererTheme;
};

export default function TeamIndex({ team, theme }: TeamIndexProps) {
  return (
    <main
      className="min-h-screen bg-[#07171a] px-5 pb-8 pt-28 text-[#f8f1e4] sm:px-8 sm:pt-32"
      style={{
        backgroundColor: theme.background,
        color: theme.foreground,
      }}
    >
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#07171a]/10 bg-[rgba(255,255,255,0.94)] text-[#07171a] shadow-[0_10px_30px_rgba(7,23,26,0.08)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 text-sm sm:px-8">
          <Link href="/" className="font-serif text-lg hover:text-[#c8a968]">
            SAB Legal Service
          </Link>
          <Link href="/blog" className="text-[#425254] hover:text-[#c8a968]">
            Blog
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl">
        <header className="grid gap-8 border-b border-[#c8a968]/25 pb-12 lg:grid-cols-[1fr_24rem]">
          <div>
            <p className="text-sm font-semibold uppercase text-[#c8a968]">
              Our Team
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-tight text-[#fff9ed] sm:text-6xl">
              Counsel, intake, and business support for serious matters.
            </h1>
          </div>
          <p className="self-end text-lg leading-8 text-[#b8c2bc]">
            A focused legal service team for consultations, document review,
            civil matters, property questions, contracts, and company support.
          </p>
        </header>

        <div className="mt-12 grid gap-px border border-[#f8f1e4]/15 bg-[#f8f1e4]/15 lg:grid-cols-3">
          {team.map((member) => (
            <article key={member.name} className="bg-[#10272b] p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase text-[#c8a968]">
                {member.role}
              </p>
              <h2 className="mt-3 font-serif text-3xl text-[#fff9ed]">
                {member.name}
              </h2>
              <p className="mt-5 leading-7 text-[#b8c2bc]">{member.bio}</p>

              <div className="mt-7 border-t border-[#f8f1e4]/15 pt-5">
                <p className="text-xs font-semibold uppercase text-[#c8a968]">
                  Focus
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[#f8f1e4]">
                  {member.focus.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 border-t border-[#f8f1e4]/15 pt-5">
                <p className="text-xs font-semibold uppercase text-[#c8a968]">
                  Credentials
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[#b8c2bc]">
                  {member.credentials.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 grid gap-2 text-sm">
                {member.phone ? (
                  <a
                    className="text-[#c8a968] hover:text-[#f3d58d]"
                    href={`tel:${member.phone.replace(/[^+\d]/g, "")}`}
                  >
                    {member.phone}
                  </a>
                ) : null}
                {member.email ? (
                  <a
                    className="text-[#c8a968] hover:text-[#f3d58d]"
                    href={`mailto:${member.email}`}
                  >
                    {member.email}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
