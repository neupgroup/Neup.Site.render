import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { toNextMetadata } from "./metadata";
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

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = getRequestHost(requestHeaders);
  const domain = resolveRendererDomainForHost(host);

  if (!domain) {
    return toNextMetadata(await getRendererRouteMetadata("sablegalservice.neup.site", []));
  }

  return toNextMetadata(await getRendererRouteMetadata(domain, []));
}

export default async function Home() {
  const requestHeaders = await headers();
  const host = getRequestHost(requestHeaders);
  const domain = resolveRendererDomainForHost(host);

  if (!domain) {
    redirect(getRendererEngineRedirectUrl(host, "/"));
  }

  const SitePage = sitePages[domain];

  return <SitePage slug={[]} />;
}
