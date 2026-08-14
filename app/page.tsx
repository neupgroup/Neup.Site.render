import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { toNextMetadata } from "./metadata";
import SitePage from "@/data/neupkishor.com/page";
import {
  getRendererEngineRedirectUrl,
  getRendererRouteMetadata,
  shouldRenderSiteForHost,
} from "@/services/renderer/_index";

const domain = "neupkishor.com";

export async function generateMetadata(): Promise<Metadata> {
  return toNextMetadata(await getRendererRouteMetadata(domain, []));
}

export default async function Home() {
  const host = (await headers()).get("host") ?? "";

  if (!shouldRenderSiteForHost(host, domain)) {
    redirect(getRendererEngineRedirectUrl());
  }

  return <SitePage slug={[]} />;
}
