import type { NextRequest } from "next/server";
import { readSiteFile } from "@/services/builder/buildmap";

export const runtime = "nodejs";

function readFilePath(request: NextRequest) {
  const filePath = request.nextUrl.searchParams.get("path");

  if (typeof filePath !== "string" || filePath.trim().length === 0) {
    throw new Error("path query parameter is required");
  }

  return filePath;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ siteid: string }> },
) {
  try {
    const { siteid } = await context.params;
    const filePath = readFilePath(request);
    const file = await readSiteFile(siteid, filePath);

    return new Response(file.content, {
      headers: {
        "Content-Length": String(file.size),
        "Content-Type": file.contentType,
      },
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === "path query parameter is required" ||
        error.message === "path is required" ||
        error.message === "path must stay inside the site root" ||
        error.message === "siteId may only contain letters, numbers, _ and -"
      ) {
        return Response.json({ error: error.message }, { status: 400 });
      }

      if (error.message === "path must point to a file") {
        return Response.json({ error: error.message }, { status: 404 });
      }
    }

    const message =
      error instanceof Error && "code" in error && error.code === "ENOENT"
        ? "File not found"
        : "Unable to read file";
    const status =
      error instanceof Error && "code" in error && error.code === "ENOENT"
        ? 404
        : 500;

    return Response.json({ error: message }, { status });
  }
}
