import type { NextRequest } from "next/server";
import {
  getRequestHost,
  getRendererSiteManifest,
  readRendererAsset,
  resolveRendererDomainForHost,
} from "@/services/renderer/_index";

function getContentType(assetName: string) {
  if (assetName.endsWith(".ico")) {
    return "image/x-icon";
  }

  if (assetName.endsWith(".svg")) {
    return "image/svg+xml";
  }

  if (assetName.endsWith(".png")) {
    return "image/png";
  }

  return "application/octet-stream";
}

export async function GET(request: NextRequest) {
  const host = getRequestHost(request.headers);
  const domain = resolveRendererDomainForHost(host);

  if (!domain) {
    return new Response("Not found", { status: 404 });
  }

  const manifest = await getRendererSiteManifest(domain);

  try {
    const asset = await readRendererAsset(domain, manifest.favicon);

    return new Response(asset, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=300",
        "Content-Type": getContentType(manifest.favicon),
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
