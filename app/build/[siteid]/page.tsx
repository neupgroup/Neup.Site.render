"use client";

/*
::neup.documentation::build-siteid-page

::public

Interactive builder page for `/build/[siteid]`. It submits build requests to the
existing site builder route and renders the build output for the selected site.

::public end

::end
*/

import { useMemo, useState, useTransition } from "react";
import { useParams } from "next/navigation";

type BuildResponse = {
  buildMapUrl: string;
  downloadedFiles: Array<{
    filename: string;
    fileUrl: string;
    inputPath: string;
    path: string;
    size?: number;
    version?: number;
  }>;
  entryPoints: string[];
  outputPath: string;
  siteInputPath: string;
};

function readErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "Build failed";
}

export default function BuildSitePage() {
  const params = useParams<{ siteid: string }>();
  const siteId = params.siteid;
  const [buildMapUrl, setBuildMapUrl] = useState("");
  const [buildPath, setBuildPath] = useState("");
  const [filesBaseUrl, setFilesBaseUrl] = useState("");
  const [result, setResult] = useState<BuildResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const endpointPath = useMemo(
    () => `/sites/build/${encodeURIComponent(siteId)}`,
    [siteId],
  );

  const defaultBuildMapUrl = useMemo(
    () =>
      `http://localhost:7483/build/${encodeURIComponent(
        siteId,
      )}/buildmap.json`,
    [siteId],
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      setError(null);

      const payload = {
        buildMapUrl: buildMapUrl.trim() || undefined,
        buildPath: buildPath.trim() || undefined,
        filesBaseUrl: filesBaseUrl.trim() || undefined,
      };

      try {
        const response = await fetch(endpointPath, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const json = (await response.json()) as BuildResponse | { error?: string };

        if (!response.ok) {
          throw new Error(
            "error" in json && typeof json.error === "string"
              ? json.error
              : "Build failed",
          );
        }

        setResult(json as BuildResponse);
      } catch (submitError) {
        setResult(null);
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
                This page triggers the existing builder endpoint and shows the
                generated paths, entry points, and downloaded source files from
                the local build map API.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-950 px-4 py-3 text-sm text-slate-100">
              <div className="text-slate-400">POST endpoint</div>
              <code className="font-mono">{endpointPath}</code>
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

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Build path
                </span>
                <input
                  type="text"
                  value={buildPath}
                  onChange={(event) => setBuildPath(event.target.value)}
                  placeholder="/"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-amber-600 focus:bg-white"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  Files base URL
                </span>
                <input
                  type="url"
                  value={filesBaseUrl}
                  onChange={(event) => setFilesBaseUrl(event.target.value)}
                  placeholder="Optional override"
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
                {isPending ? "Building..." : "Run build"}
              </button>

              {error ? (
                <p className="text-sm font-medium text-red-600">{error}</p>
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
                <dt className="font-semibold text-slate-900">Request body</dt>
                <dd className="mt-1 font-mono text-xs text-slate-600">
                  {`{ buildMapUrl?, buildPath?, filesBaseUrl? }`}
                </dd>
              </div>
            </dl>
          </aside>
        </section>

        {result ? (
          <section className="rounded-[2rem] border border-emerald-200 bg-white/90 p-8 shadow-[0_30px_100px_-40px_rgba(5,150,105,0.35)]">
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-700">
                  Build Result
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                  Generated output
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Build map</div>
                  <div className="mt-2 break-all font-mono text-sm">
                    {result.buildMapUrl}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Site input path</div>
                  <div className="mt-2 break-all font-mono text-sm">
                    {result.siteInputPath}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Output path</div>
                  <div className="mt-2 break-all font-mono text-sm">
                    {result.outputPath}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">
                    Entry points
                  </h3>
                  <ul className="mt-4 grid gap-3">
                    {result.entryPoints.map((entryPoint) => (
                      <li
                        key={entryPoint}
                        className="rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm break-all"
                      >
                        {entryPoint}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">
                    Downloaded files
                  </h3>
                  <ul className="mt-4 grid gap-3">
                    {result.downloadedFiles.map((file) => (
                      <li
                        key={`${file.path}/${file.filename}`}
                        className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                      >
                        <div className="font-semibold text-slate-950">
                          {file.filename}
                        </div>
                        <div className="mt-1 font-mono text-xs break-all">
                          {file.inputPath}
                        </div>
                        <div className="mt-2 flex gap-3 font-mono text-xs text-slate-500">
                          <span>path: {file.path}</span>
                          <span>size: {file.size ?? "-"}</span>
                          <span>version: {file.version ?? "-"}</span>
                        </div>
                        <div className="mt-2 font-mono text-xs break-all text-slate-500">
                          {file.fileUrl}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
