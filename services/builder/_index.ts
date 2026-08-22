import "server-only";

import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import type { BuildOptions, BuildResult } from "esbuild";

export type BuilderInputPath = `@/input/${string}` | `input/${string}` | string;

export type BuildInputCodeOptions = {
  inputPath: BuilderInputPath;
  bundle?: boolean;
  esbuildOptions?: Omit<
    BuildOptions,
    "bundle" | "entryPoints" | "outbase" | "outdir" | "outfile" | "write"
  >;
  inputRoot?: string;
  outputRoot?: string;
};

export type BuildInputCodeResult = {
  entryPoints: string[];
  outputPath: string;
  result: BuildResult;
};

export type RemoteBuildMapFile = {
  path: string;
  size?: number;
  version?: number;
};

export type DownloadedBuildMapFile = RemoteBuildMapFile & {
  filename: string;
  fileUrl: string;
  inputPath: string;
};

export type BuildRemoteSiteCodeOptions = {
  buildMapUrl?: string;
  buildPath?: string;
  bundle?: boolean;
  esbuildOptions?: BuildInputCodeOptions["esbuildOptions"];
  filesBaseUrl?: string;
  inputRoot?: string;
  outputRoot?: string;
  siteId: string;
};

export type BuildRemoteSiteCodeResult = BuildInputCodeResult & {
  buildMapUrl: string;
  downloadedFiles: DownloadedBuildMapFile[];
  siteInputPath: string;
};

export class BuilderError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "BuilderError";
  }
}

const buildableExtensions = new Set([
  ".cjs",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".mts",
  ".ts",
  ".tsx",
]);

const require = createRequire(import.meta.url);

function getEsbuild() {
  return require("esbuild") as {
    build: (options: BuildOptions) => Promise<BuildResult>;
  };
}

function logBuilderEvent(message: string, details: Record<string, unknown>) {
  console.info(`[builder] ${message}`, details);
}

function resolveProjectPath(projectPath: string) {
  return path.resolve(
    process.cwd(),
    projectPath.startsWith("@/") ? projectPath.slice(2) : projectPath,
  );
}

function toProjectPath(targetPath: string) {
  return targetPath.startsWith(process.cwd())
    ? path.relative(process.cwd(), targetPath)
    : targetPath;
}

function getSiteRawRoot(siteId: string) {
  return path.join("iobox", siteId, "raw");
}

function getSiteBuildRoot(siteId: string) {
  return path.join("iobox", siteId, "build");
}

function assertInsidePath(targetPath: string, parentPath: string, label: string) {
  const relativePath = path.relative(parentPath, targetPath);

  if (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !path.isAbsolute(relativePath))
  ) {
    return;
  }

  throw new Error(`${label} must stay inside ${parentPath}`);
}

function assertValidSiteId(siteId: string) {
  if (/^[a-zA-Z0-9_-]+$/.test(siteId)) {
    return;
  }

  throw new BuilderError(
    "siteId may only contain letters, numbers, _ and -",
    400,
  );
}

function getAllowedRemoteOrigins() {
  return new Set(
    (
      process.env.BUILDER_ALLOWED_REMOTE_ORIGINS ??
      "https://neupgroup.com,http://localhost:7483,https://localhost:7483"
    )
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
}

function assertAllowedRemoteUrl(sourceUrl: string, label: string) {
  let url: URL;

  try {
    url = new URL(sourceUrl);
  } catch {
    throw new BuilderError(`${label} must be a valid URL`, 400);
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new BuilderError(`${label} must use http or https`, 400);
  }

  if (url.protocol === "http:" && url.hostname !== "localhost") {
    throw new BuilderError(`${label} may only use http for localhost`, 400);
  }

  if (!getAllowedRemoteOrigins().has(url.origin)) {
    throw new BuilderError(`${label} origin is not allowed`, 403);
  }

  return url;
}

function normalizeRemoteFilePath(remotePath: string) {
  if (remotePath.length === 0) {
    throw new BuilderError("Build map file paths must not be empty", 422);
  }

  const normalizedPath = path.posix.normalize(remotePath);

  if (
    normalizedPath === "." ||
    normalizedPath === ".." ||
    normalizedPath.startsWith("../") ||
    normalizedPath.startsWith("/") ||
    path.posix.isAbsolute(normalizedPath)
  ) {
    throw new BuilderError("Build map file paths must stay inside the site root", 422);
  }

  return normalizedPath;
}

function normalizeBuildPath(buildPath: string) {
  if (buildPath === "/") {
    return "";
  }

  return normalizeRemoteFilePath(buildPath.startsWith("/") ? buildPath.slice(1) : buildPath);
}

function readRemoteBuildMapFile(source: unknown): RemoteBuildMapFile {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new BuilderError("Build map entries must be objects", 422);
  }

  const record = source as Record<string, unknown>;
  const remotePath = record.path;
  const size = record.size;
  const version = record.version;

  if (typeof remotePath !== "string") {
    throw new BuilderError("Build map entries must include a path string", 422);
  }

  if (
    size != null &&
    (typeof size !== "number" || !Number.isInteger(size) || size < 0)
  ) {
    throw new BuilderError("Build map entry size must be a non-negative integer", 422);
  }

  if (
    version != null &&
    (typeof version !== "number" || !Number.isInteger(version))
  ) {
    throw new BuilderError("Build map entry version must be an integer", 422);
  }

  return {
    path: normalizeRemoteFilePath(remotePath),
    size: typeof size === "number" ? size : undefined,
    version: typeof version === "number" ? version : undefined,
  };
}

function readRemoteBuildMap(source: unknown) {
  if (!Array.isArray(source)) {
    throw new BuilderError("Build map must be an array", 422);
  }

  return source.map(readRemoteBuildMapFile);
}

function appendPathname(baseUrl: URL, remotePath: string) {
  const pathSegments = remotePath
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent);
  const basePathname = baseUrl.pathname.replace(/\/$/, "");

  return [
    basePathname,
    ...pathSegments,
  ].join("/");
}

function getDefaultBuildMapUrl(siteId: string) {
  return `https://neupgroup.com/sites/build/${encodeURIComponent(
    siteId,
  )}/buildmap.json`;
}

function getDefaultFilesBaseUrl(siteId: string, buildMapUrl: string) {
  const url = assertAllowedRemoteUrl(buildMapUrl, "buildMapUrl");
  url.pathname = `/sites/build/${encodeURIComponent(siteId)}`;
  url.search = "";
  url.hash = "";
  return url.toString();
}

function isBuildableSourceFile(filePath: string) {
  return (
    buildableExtensions.has(path.extname(filePath)) &&
    !filePath.endsWith(".d.ts")
  );
}

async function collectBuildableSourceFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "node_modules") {
          return [];
        }

        return collectBuildableSourceFiles(entryPath);
      }

      return entry.isFile() && isBuildableSourceFile(entryPath)
        ? [entryPath]
        : [];
    }),
  );

  return files.flat().sort();
}

export async function buildInputCode(
  options: BuildInputCodeOptions,
): Promise<BuildInputCodeResult> {
  const { build } = getEsbuild();
  const inputRoot = resolveProjectPath(options.inputRoot ?? "input");
  const outputRoot = resolveProjectPath(options.outputRoot ?? "output");
  const inputPath = resolveProjectPath(options.inputPath);

  assertInsidePath(inputPath, inputRoot, "inputPath");

  const inputStats = await stat(inputPath);
  const inputRelativePath = path.relative(inputRoot, inputPath);
  const outputPath = path.join(outputRoot, inputRelativePath);
  const outputDirectory = inputStats.isDirectory()
    ? outputPath
    : path.dirname(outputPath);

  assertInsidePath(outputPath, outputRoot, "outputPath");

  const entryPoints = inputStats.isDirectory()
    ? await collectBuildableSourceFiles(inputPath)
    : isBuildableSourceFile(inputPath)
      ? [inputPath]
      : [];

  if (entryPoints.length === 0) {
    throw new Error(`No buildable source files found in ${inputPath}`);
  }

  const result = await build({
    absWorkingDir: process.cwd(),
    bundle: options.bundle ?? true,
    entryPoints,
    format: "esm",
    outbase: inputStats.isDirectory() ? inputPath : path.dirname(inputPath),
    outdir: outputDirectory,
    platform: "browser",
    sourcemap: true,
    target: "es2022",
    write: true,
    ...options.esbuildOptions,
  });

  return {
    entryPoints,
    outputPath: outputDirectory,
    result,
  };
}

export async function fetchRemoteBuildMap(buildMapUrl: string) {
  const url = assertAllowedRemoteUrl(buildMapUrl, "buildMapUrl");
  let response: Response;

  try {
    logBuilderEvent("fetch remote build map", {
      method: "GET",
      absoluteUrl: url.toString(),
    });
    response = await fetch(url);
  } catch {
    throw new BuilderError("Unable to fetch build map", 502);
  }

  logBuilderEvent("remote build map response", {
    method: "GET",
    absoluteUrl: url.toString(),
    status: response.status,
    statusText: response.statusText,
  });

  if (!response.ok) {
    throw new BuilderError(
      `Build map request failed with ${response.status}`,
      response.status >= 400 && response.status < 500 ? response.status : 502,
    );
  }

  let json: unknown;

  try {
    json = await response.json();
  } catch {
    throw new BuilderError("Build map response must be JSON", 422);
  }

  return readRemoteBuildMap(json);
}

export async function downloadRemoteBuildMapFiles(options: {
  buildMap: RemoteBuildMapFile[];
  filesBaseUrl: string;
  inputRoot?: string;
  siteId: string;
}) {
  assertValidSiteId(options.siteId);

  const inputRoot = resolveProjectPath(
    options.inputRoot ?? getSiteRawRoot(options.siteId),
  );
  const siteInputPath = inputRoot;
  const filesBaseUrl = assertAllowedRemoteUrl(
    options.filesBaseUrl,
    "filesBaseUrl",
  );
  const downloadedFiles: DownloadedBuildMapFile[] = [];

  logBuilderEvent("prepare remote file downloads", {
    siteId: options.siteId,
    filesBaseUrl: filesBaseUrl.toString(),
    siteInputPath,
    buildMapCount: options.buildMap.length,
  });

  assertInsidePath(siteInputPath, inputRoot, "siteInputPath");

  for (const file of options.buildMap) {
    const inputPath = path.join(siteInputPath, file.path);
    const inputDirectory = path.dirname(inputPath);
    const filename = path.basename(file.path);

    assertInsidePath(inputPath, siteInputPath, "build map file");

    const fileUrl = new URL(filesBaseUrl);
    fileUrl.pathname = appendPathname(filesBaseUrl, file.path);

    let response: Response;

    try {
      logBuilderEvent("fetch remote file", {
        method: "GET",
        absoluteUrl: fileUrl.toString(),
        remotePath: file.path,
        localInputPath: inputPath,
      });
      response = await fetch(fileUrl);
    } catch {
      throw new BuilderError(`Unable to fetch ${fileUrl.toString()}`, 502);
    }

    logBuilderEvent("remote file response", {
      method: "GET",
      absoluteUrl: fileUrl.toString(),
      remotePath: file.path,
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      throw new BuilderError(
        `File request failed with ${response.status}: ${fileUrl.toString()}`,
        response.status >= 400 && response.status < 500 ? response.status : 502,
      );
    }

    await mkdir(inputDirectory, { recursive: true });
    await writeFile(inputPath, Buffer.from(await response.arrayBuffer()));

    downloadedFiles.push({
      ...file,
      filename,
      fileUrl: fileUrl.toString(),
      inputPath,
    });
  }

  return {
    downloadedFiles,
    siteInputPath,
  };
}

export async function buildRemoteSiteCode(
  options: BuildRemoteSiteCodeOptions,
): Promise<BuildRemoteSiteCodeResult> {
  assertValidSiteId(options.siteId);

  const inputRoot = options.inputRoot ?? getSiteRawRoot(options.siteId);
  const outputRoot = options.outputRoot ?? getSiteBuildRoot(options.siteId);

  const buildMapUrl =
    options.buildMapUrl ?? getDefaultBuildMapUrl(options.siteId);
  const filesBaseUrl =
    options.filesBaseUrl ?? getDefaultFilesBaseUrl(options.siteId, buildMapUrl);
  logBuilderEvent("start remote site build", {
    siteId: options.siteId,
    buildMapUrl,
    filesBaseUrl,
    buildPath: options.buildPath ?? "/",
    inputRoot,
    outputRoot,
  });
  const buildMap = await fetchRemoteBuildMap(buildMapUrl);
  const { downloadedFiles, siteInputPath } = await downloadRemoteBuildMapFiles({
    buildMap,
    filesBaseUrl,
    inputRoot,
    siteId: options.siteId,
  });
  const buildTarget = path.join(
    siteInputPath,
    options.buildPath ? normalizeBuildPath(options.buildPath) : "",
  );
  const buildResult = await buildInputCode({
    bundle: options.bundle,
    esbuildOptions: options.esbuildOptions,
    inputPath: toProjectPath(buildTarget),
    inputRoot,
    outputRoot,
  });

  logBuilderEvent("build completed", {
    siteId: options.siteId,
    buildTarget,
    siteInputPath,
    outputPath: buildResult.outputPath,
    downloadedFileCount: downloadedFiles.length,
    entryPointCount: buildResult.entryPoints.length,
  });

  return {
    ...buildResult,
    buildMapUrl,
    downloadedFiles,
    siteInputPath,
  };
}
