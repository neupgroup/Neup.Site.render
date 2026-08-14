import type { NextRequest } from "next/server";
import {
  getRendererSiteManifest,
  shouldRenderSiteForHost,
} from "@/services/renderer/_index";

const domain = "neupkishor.com";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (!shouldRenderSiteForHost(host, domain)) {
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
          type: "image/x-icon",
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
