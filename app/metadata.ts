import type { Metadata } from "next";
import type { RendererRouteMetadata } from "@/services/renderer/_index";

export function toNextMetadata(routeMetadata: RendererRouteMetadata): Metadata {
  const metadataBase = new URL(`https://${routeMetadata.domain}`);

  return {
    title: routeMetadata.title,
    description: routeMetadata.description,
    applicationName: routeMetadata.name,
    metadataBase,
    alternates: {
      canonical: routeMetadata.canonicalPath,
    },
    icons: {
      icon: [
        {
          url: routeMetadata.faviconPath,
          sizes: "any",
        },
      ],
      shortcut: [routeMetadata.faviconPath],
    },
    manifest: "/manifest.json",
    openGraph: {
      title: routeMetadata.title,
      description: routeMetadata.description,
      siteName: routeMetadata.name,
      locale: routeMetadata.locale,
      type: "website",
      url: routeMetadata.canonicalPath,
    },
    twitter: {
      card: "summary",
      title: routeMetadata.title,
      description: routeMetadata.description,
    },
  };
}
