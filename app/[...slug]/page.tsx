import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { toNextMetadata } from "../metadata";
import NeupKishorSitePage from "@/data/neupkishor.com/page";
import SablegalserviceSitePage from "@/data/sablegalservice.neup.site/page";
import {
  getRendererEngineRedirectUrl,
  getRequestHost,
  getRendererRouteMetadata,
  resolveRendererDomainForHost,
  type RendererSiteDomain,
} from "@/services/renderer/_index";

const sitePages = {
  "neupkishor.com": NeupKishorSitePage,
  "sablegalservice.neup.site": SablegalserviceSitePage,
} satisfies Record<RendererSiteDomain, typeof NeupKishorSitePage>;

type CatchAllPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: CatchAllPageProps): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = getRequestHost(requestHeaders);
  const domain = resolveRendererDomainForHost(host) ?? "sablegalservice.neup.site";
  const { slug } = await params;
  return toNextMetadata(await getRendererRouteMetadata(domain, slug));
}

export default async function CatchAllPage({
  params,
}: CatchAllPageProps) {
  const requestHeaders = await headers();
  const host = getRequestHost(requestHeaders);
  const domain = resolveRendererDomainForHost(host);
  const { slug } = await params;
  const requestedPath = `/${slug.join("/")}`;

  if (!domain) {
    redirect(getRendererEngineRedirectUrl(host, requestedPath));
  }

  const SitePage = sitePages[domain];

  return <SitePage slug={slug} />;
}
