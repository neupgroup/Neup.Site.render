import { getRendererPageContent } from "@/services/renderer/_index";
import Button from "@/data/neupkishor.com/components/button";

const domain = "neupkishor.com";

export default async function Home() {
  const page = await getRendererPageContent(domain);

  return (
    <main
      className="flex min-h-screen flex-1 items-center px-6 py-16 sm:px-12"
      style={{
        backgroundColor: page.theme.background,
        color: page.theme.foreground,
      }}
    >
      <section
        className="mx-auto w-full max-w-4xl rounded-[2rem] border p-8 shadow-sm sm:p-12"
        style={{
          backgroundColor: page.theme.surface,
          borderColor: page.theme.accent,
        }}
      >
        <p
          className="mb-4 text-sm font-semibold uppercase tracking-[0.3em]"
          style={{ color: page.theme.accent }}
        >
          {page.eyebrow}
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          {page.heading}
        </h1>
        <p
          className="mt-6 max-w-2xl text-lg leading-8"
          style={{ color: page.theme.muted }}
        >
          {page.summary}
        </p>
        <div className="mt-8">
          <Button {...page.componentProps.button} />
        </div>
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
