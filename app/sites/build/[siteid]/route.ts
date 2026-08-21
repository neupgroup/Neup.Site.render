import type { NextRequest } from "next/server";
import {
  buildRemoteSiteCode,
  BuilderError,
  type BuildRemoteSiteCodeOptions,
} from "@/services/builder/_index";

export const runtime = "nodejs";

type BuildRequestBody = {
  buildMapUrl?: string;
  buildPath?: string;
  filesBaseUrl?: string;
};

function readOptionalString(
  source: Record<string, unknown>,
  key: keyof BuildRequestBody,
) {
  const value = source[key];
  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
}

async function readBuildRequestBody(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const queryBody = {
    buildMapUrl: query.get("buildMapUrl") ?? undefined,
    buildPath: query.get("buildPath") ?? undefined,
    filesBaseUrl: query.get("filesBaseUrl") ?? undefined,
  };
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return queryBody;
  }

  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new BuilderError("Request body must be a JSON object", 400);
  }

  const record = json as Record<string, unknown>;

  return {
    buildMapUrl:
      readOptionalString(record, "buildMapUrl") ?? queryBody.buildMapUrl,
    buildPath: readOptionalString(record, "buildPath") ?? queryBody.buildPath,
    filesBaseUrl:
      readOptionalString(record, "filesBaseUrl") ?? queryBody.filesBaseUrl,
  };
}

function toResponsePath(filePath: string) {
  return filePath.replace(process.cwd(), "@");
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ siteid: string }> },
) {
  try {
    const { siteid } = await context.params;
    const body = await readBuildRequestBody(request);
    const options: BuildRemoteSiteCodeOptions = {
      ...body,
      siteId: siteid,
    };
    const result = await buildRemoteSiteCode(options);

    return Response.json(
      {
        buildMapUrl: result.buildMapUrl,
        downloadedFiles: result.downloadedFiles.map((file) => ({
          filename: file.filename,
          fileUrl: file.fileUrl,
          inputPath: toResponsePath(file.inputPath),
          path: file.path,
        })),
        entryPoints: result.entryPoints.map(toResponsePath),
        outputPath: toResponsePath(result.outputPath),
        siteInputPath: toResponsePath(result.siteInputPath),
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof BuilderError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json({ error: "Build failed" }, { status: 500 });
  }
}
