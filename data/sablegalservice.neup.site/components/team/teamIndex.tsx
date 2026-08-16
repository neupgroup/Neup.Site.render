import Link from "next/link";
import type { RendererTeamMember, RendererTheme } from "@/services/renderer/_index";

type TeamIndexProps = {
  team: RendererTeamMember[];
  theme: RendererTheme;
};

export default function TeamIndex({ team, theme }: TeamIndexProps) {
  return (
    <main
      className="min-h-screen bg-[#07171a] px-5 py-8 text-[#f8f1e4] sm:px-8"
      style={{
        backgroundColor: theme.background,
        color: theme.foreground,
      }}
    >
      <section className="mx-auto max-w-7xl">
        <nav className="mb-12 flex items-center justify-between text-sm">
          <Link href="/" className="font-serif text-lg hover:text-[#c8a968]">
            SAB Legal Service
          </Link>
          <Link href="/blog" className="text-[#b8c2bc] hover:text-[#c8a968]">
            Blog
          </Link>
        </nav>

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
