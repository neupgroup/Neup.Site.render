import type { NextRequest } from "next/server";

import {
  BuilderError,
  fetchRemoteBuildMap,
} from "@/services/builder/_index";

export const runtime = "nodejs";

type BuildRequestQuery = {
  buildMapUrl?: string;
};

function readOptionalString(
  source: Record<string, unknown>,
  key: keyof BuildRequestQuery,
) {
  const value = source[key];
  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
}

function readBuildRequestQuery(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const record = {
    buildMapUrl: query.get("buildMapUrl"),
  };

  return {
    buildMapUrl: readOptionalString(record, "buildMapUrl"),
  };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ siteid: string }> },
) {
  try {
    const { siteid } = await context.params;
    const query = readBuildRequestQuery(request);
    console.info("[builder.route] incoming request", {
      method: request.method,
      url: request.nextUrl.toString(),
      siteId: siteid,
      query,
    });
    const buildMapUrl =
      query.buildMapUrl ??
      `https://neupgroup.com/sites/build/${encodeURIComponent(siteid)}/buildmap.json`;
    const buildMap = await fetchRemoteBuildMap(buildMapUrl);

    console.info("[builder.route] response ready", {
      siteId: siteid,
      buildMapUrl,
      buildMapCount: buildMap.length,
    });

    return Response.json(buildMap, { status: 200 });
  } catch (error) {
    console.error("[builder.route] request failed", error);
    if (error instanceof BuilderError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json({ error: "Unable to read files map" }, { status: 500 });
  }
}
