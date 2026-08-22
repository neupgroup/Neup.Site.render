"use client";

/*
::neup.documentation::build-siteid-page-client

::public

Interactive client UI for `/build/[siteid]`. It fetches a local build map in
the browser and renders the returned file list for the selected site.

::public end

::end
*/

import { useMemo, useState, useTransition } from "react";

type BuildSitePageClientProps = {
  siteId: string;
};

type BuildMapFile = {
  path: string;
  size?: number;
  version?: number;
};

function readErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "Fetch failed";
}

async function readResponseError(response: Response) {
  const responseText = await response.text();

  if (responseText.trim().length === 0) {
    return `Request failed with ${response.status} ${response.statusText}`;
  }

  return [
    `Request failed with ${response.status} ${response.statusText}`,
    responseText,
  ].join("\n\n");
}

export default function BuildSitePageClient({
  siteId,
}: BuildSitePageClientProps) {
  const [buildMapUrl, setBuildMapUrl] = useState("");
  const [buildMap, setBuildMap] = useState<BuildMapFile[]>([]);
  const [resolvedBuildMapUrl, setResolvedBuildMapUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const defaultBuildMapUrl = useMemo(
    () =>
      `https://neupgroup.com/sites/build/${encodeURIComponent(
        siteId,
      )}/buildmap.json`,
    [siteId],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      setError(null);
      const requestedBuildMapUrl = buildMapUrl.trim() || defaultBuildMapUrl;

      try {
        console.info("[builder.page] fetching local build map", {
          method: "GET",
          absoluteUrl: requestedBuildMapUrl,
        });
        const response = await fetch(requestedBuildMapUrl, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(await readResponseError(response));
        }

        const json = (await response.json()) as unknown;

        if (!Array.isArray(json)) {
          throw new Error("Build map response must be a JSON array");
        }

        setBuildMap(json as BuildMapFile[]);
        setResolvedBuildMapUrl(requestedBuildMapUrl);
      } catch (submitError) {
        setBuildMap([]);
        setResolvedBuildMapUrl("");
        setError(readErrorMessage(submitError));
      }
    });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.07),_transparent_45%),linear-gradient(180deg,_#fffaf0_0%,_#ffffff_45%,_#eef6ff_100%)] px-6 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-[0_30px_100px_-40px_rgba(15,23,42,0.55)] backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-slate-500">
            Site Builder
          </p>
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl leading-tight md:text-5xl">
                Build site <span className="text-amber-700">{siteId}</span>
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                This page fetches the build map directly from
                `neupgroup.com/sites/build/[id]/buildmap.json` in the browser
                and shows the files on the page without routing through this
                app&apos;s server.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-950 px-4 py-3 text-sm text-slate-100">
              <div className="text-slate-400">Direct local request</div>
              <code className="font-mono">{defaultBuildMapUrl}</code>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-black/10 bg-white/85 p-8 shadow-[0_30px_100px_-40px_rgba(15,23,42,0.45)]"
          >
            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Build map URL
                </span>
                <input
                  type="url"
                  value={buildMapUrl}
                  onChange={(event) => setBuildMapUrl(event.target.value)}
                  placeholder={defaultBuildMapUrl}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-amber-600 focus:bg-white"
                />
              </label>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-400"
              >
                {isPending ? "Fetching files..." : "Fetch files map"}
              </button>

              {error ? (
                <pre className="max-w-full overflow-x-auto whitespace-pre-wrap rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </pre>
              ) : null}
            </div>
          </form>

          <aside className="rounded-[2rem] border border-amber-200 bg-amber-50/80 p-8 shadow-[0_30px_100px_-40px_rgba(180,83,9,0.35)]">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-700">
              Defaults
            </p>
            <dl className="mt-4 grid gap-5 text-sm text-slate-700">
              <div>
                <dt className="font-semibold text-slate-900">Site ID</dt>
                <dd className="mt-1 break-all font-mono">{siteId}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">Default build map</dt>
                <dd className="mt-1 break-all font-mono">{defaultBuildMapUrl}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">Request method</dt>
                <dd className="mt-1 font-mono text-xs text-slate-600">
                  GET from the browser
                </dd>
              </div>
            </dl>
          </aside>
        </section>

        {resolvedBuildMapUrl ? (
          <section className="rounded-[2rem] border border-emerald-200 bg-white/90 p-8 shadow-[0_30px_100px_-40px_rgba(5,150,105,0.35)]">
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-700">
                  Build Map
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                  Fetched files
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">
                    Fetched files map
                  </h3>
                  <div className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs text-slate-600">
                    {buildMap.length} files
                  </div>
                </div>
                <ul className="mt-4 grid gap-3">
                  {buildMap.map((file) => (
                    <li
                      key={file.path}
                      className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      <div className="font-mono break-all text-slate-950">
                        {file.path}
                      </div>
                      <div className="mt-2 flex gap-3 font-mono text-xs text-slate-500">
                        <span>size: {file.size ?? "-"}</span>
                        <span>version: {file.version ?? "-"}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 md:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Requested build map URL</div>
                  <div className="mt-2 break-all font-mono text-sm">
                    {resolvedBuildMapUrl}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
