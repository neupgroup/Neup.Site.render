import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { build, type BuildOptions, type BuildResult } from "esbuild";

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
  filename: string;
  path: string;
};

export type DownloadedBuildMapFile = RemoteBuildMapFile & {
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
    (process.env.BUILDER_ALLOWED_REMOTE_ORIGINS ?? "https://neupgroup.com")
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

  if (url.protocol !== "https:") {
    throw new BuilderError(`${label} must use https`, 400);
  }

  if (!getAllowedRemoteOrigins().has(url.origin)) {
    throw new BuilderError(`${label} origin is not allowed`, 403);
  }

  return url;
}

function normalizeRemoteDirectory(remotePath: string) {
  if (!remotePath.startsWith("/")) {
    throw new BuilderError("Build map file paths must start with /", 422);
  }

  const normalizedPath = path.posix.normalize(remotePath);

  if (normalizedPath === "/") {
    return "/";
  }

  if (normalizedPath.startsWith("/../") || normalizedPath === "/..") {
    throw new BuilderError("Build map file paths must stay inside /", 422);
  }

  return normalizedPath;
}

function normalizeRemoteFilename(filename: string) {
  if (
    filename.length === 0 ||
    filename.includes("/") ||
    filename.includes("\\") ||
    filename === "." ||
    filename === ".."
  ) {
    throw new BuilderError("Build map filenames must be plain filenames", 422);
  }

  return filename;
}

function readRemoteBuildMapFile(source: unknown): RemoteBuildMapFile {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new BuilderError("Build map entries must be objects", 422);
  }

  const record = source as Record<string, unknown>;
  const filename = record.filename;
  const remotePath = record.path;

  if (typeof filename !== "string" || typeof remotePath !== "string") {
    throw new BuilderError(
      "Build map entries must include filename and path strings",
      422,
    );
  }

  return {
    filename: normalizeRemoteFilename(filename),
    path: normalizeRemoteDirectory(remotePath),
  };
}

function readRemoteBuildMap(source: unknown) {
  if (!Array.isArray(source)) {
    throw new BuilderError("Build map must be an array", 422);
  }

  return source.map(readRemoteBuildMapFile);
}

function appendPathname(baseUrl: URL, remotePath: string, filename: string) {
  const pathSegments = remotePath
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent);
  const filenameSegment = encodeURIComponent(filename);
  const basePathname = baseUrl.pathname.replace(/\/$/, "");

  return [
    basePathname,
    ...pathSegments,
    filenameSegment,
  ].join("/");
}

function getDefaultBuildMapUrl(siteId: string) {
  return `https://neupgroup.com/sites/build/${encodeURIComponent(
    siteId,
  )}/buildmap.json`;
}

function getDefaultFilesBaseUrl(siteId: string, buildMapUrl: string) {
  const url = assertAllowedRemoteUrl(buildMapUrl, "buildMapUrl");
  url.pathname = `/sites/builder/${encodeURIComponent(siteId)}/files`;
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
    response = await fetch(url);
  } catch {
    throw new BuilderError("Unable to fetch build map", 502);
  }

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

  const inputRoot = resolveProjectPath(options.inputRoot ?? "input");
  const siteInputPath = path.join(inputRoot, options.siteId);
  const filesBaseUrl = assertAllowedRemoteUrl(
    options.filesBaseUrl,
    "filesBaseUrl",
  );
  const downloadedFiles: DownloadedBuildMapFile[] = [];

  assertInsidePath(siteInputPath, inputRoot, "siteInputPath");

  for (const file of options.buildMap) {
    const inputDirectory = path.join(
      siteInputPath,
      file.path === "/" ? "" : file.path.slice(1),
    );
    const inputPath = path.join(inputDirectory, file.filename);

    assertInsidePath(inputPath, siteInputPath, "build map file");

    const fileUrl = new URL(filesBaseUrl);
    fileUrl.pathname = appendPathname(filesBaseUrl, file.path, file.filename);

    let response: Response;

    try {
      response = await fetch(fileUrl);
    } catch {
      throw new BuilderError(`Unable to fetch ${fileUrl.toString()}`, 502);
    }

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

  const buildMapUrl =
    options.buildMapUrl ?? getDefaultBuildMapUrl(options.siteId);
  const filesBaseUrl =
    options.filesBaseUrl ?? getDefaultFilesBaseUrl(options.siteId, buildMapUrl);
  const buildMap = await fetchRemoteBuildMap(buildMapUrl);
  const { downloadedFiles, siteInputPath } = await downloadRemoteBuildMapFiles({
    buildMap,
    filesBaseUrl,
    inputRoot: options.inputRoot,
    siteId: options.siteId,
  });
  const buildTarget = path.join(
    siteInputPath,
    options.buildPath ? normalizeRemoteDirectory(options.buildPath).slice(1) : "",
  );
  const buildResult = await buildInputCode({
    bundle: options.bundle,
    esbuildOptions: options.esbuildOptions,
    inputPath: toProjectPath(buildTarget),
    inputRoot: options.inputRoot,
    outputRoot: options.outputRoot,
  });

  return {
    ...buildResult,
    buildMapUrl,
    downloadedFiles,
    siteInputPath,
  };
}
