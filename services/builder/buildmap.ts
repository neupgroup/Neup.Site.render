import "server-only";

import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

import type { RemoteBuildMapFile } from "@/services/builder/_index";

/*
::neup.documentation::builder-buildmap-service

Collects a normalized list of files for a builder input directory.

::end
*/

function resolveProjectPath(projectPath: string) {
  return path.resolve(
    process.cwd(),
    projectPath.startsWith("@/") ? projectPath.slice(2) : projectPath,
  );
}

function normalizeBuildMapPath(filePath: string) {
  return filePath.split(path.sep).join(path.posix.sep);
}

function getSiteRawRoot(siteId: string) {
  if (!/^[a-zA-Z0-9_-]+$/.test(siteId)) {
    throw new Error("siteId may only contain letters, numbers, _ and -");
  }

  return resolveProjectPath(path.join("iobox", siteId, "raw"));
}

function normalizeSiteFilePath(filePath: string) {
  if (filePath.trim().length === 0) {
    throw new Error("path is required");
  }

  const normalizedPath = path.posix.normalize(filePath);

  if (
    normalizedPath === "." ||
    normalizedPath === ".." ||
    normalizedPath.startsWith("../") ||
    normalizedPath.startsWith("/") ||
    path.posix.isAbsolute(normalizedPath)
  ) {
    throw new Error("path must stay inside the site root");
  }

  return normalizedPath;
}

function resolveSiteFilePath(siteId: string, filePath: string) {
  const siteRoot = getSiteRawRoot(siteId);
  const normalizedPath = normalizeSiteFilePath(filePath);
  const absolutePath = path.join(siteRoot, normalizedPath);
  const relativePath = path.relative(siteRoot, absolutePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("path must stay inside the site root");
  }

  return {
    absolutePath,
    normalizedPath,
    siteRoot,
  };
}

function getFileContentType(filePath: string) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".css":
      return "text/css; charset=utf-8";
    case ".csv":
      return "text/csv; charset=utf-8";
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
    case ".mjs":
    case ".cjs":
      return "text/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".jsx":
      return "text/jsx; charset=utf-8";
    case ".md":
      return "text/markdown; charset=utf-8";
    case ".png":
      return "image/png";
    case ".svg":
      return "image/svg+xml";
    case ".ts":
      return "text/typescript; charset=utf-8";
    case ".tsx":
      return "text/tsx; charset=utf-8";
    case ".txt":
      return "text/plain; charset=utf-8";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

export async function fetchBuildMapFiles(
  inputPath: string,
): Promise<RemoteBuildMapFile[]> {
  const rootPath = resolveProjectPath(inputPath);

  async function walk(directoryPath: string): Promise<RemoteBuildMapFile[]> {
    const entries = await readdir(directoryPath, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(directoryPath, entry.name);

        if (entry.isDirectory()) {
          if (entry.name === "node_modules") {
            return [];
          }

          return walk(entryPath);
        }

        if (!entry.isFile()) {
          return [];
        }

        const fileStats = await stat(entryPath);
        const relativePath = path.relative(rootPath, entryPath);

        return [
          {
            path: normalizeBuildMapPath(relativePath),
            size: fileStats.size,
          },
        ];
      }),
    );

    return files.flat().sort((left, right) => left.path.localeCompare(right.path));
  }

  return walk(rootPath);
}

export async function readSiteFile(siteId: string, filePath: string) {
  const { absolutePath, normalizedPath } = resolveSiteFilePath(siteId, filePath);
  const fileStats = await stat(absolutePath);

  if (!fileStats.isFile()) {
    throw new Error("path must point to a file");
  }

  return {
    content: await readFile(absolutePath),
    contentType: getFileContentType(normalizedPath),
    path: normalizedPath,
    size: fileStats.size,
  };
}
