import type { NextRequest } from "next/server";
import {
  getRequestHost,
  getRendererSiteManifest,
  resolveRendererDomainForHost,
} from "@/services/renderer/_index";

export async function GET(request: NextRequest) {
  const host = getRequestHost(request.headers);
  const domain = resolveRendererDomainForHost(host);

  if (!domain) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const manifest = await getRendererSiteManifest(domain);

  return Response.json(
    {
      name: manifest.name,
      short_name: manifest.name,
      description: manifest.description,
      start_url: "/",
      display: "standalone",
      lang: manifest.locale,
      icons: [
        {
          src: "/favicon.ico",
          sizes: "any",
          type: manifest.favicon.endsWith(".png") ? "image/png" : "image/x-icon",
        },
      ],
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=300",
      },
    },
  );
}
