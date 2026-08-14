import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { toNextMetadata } from "../metadata";
import SitePage from "@/data/neupkishor.com/page";
import {
  getRendererEngineRedirectUrl,
  getRendererRouteMetadata,
  shouldRenderSiteForHost,
} from "@/services/renderer/_index";

const domain = "neupkishor.com";

type CatchAllPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: CatchAllPageProps): Promise<Metadata> {
  const { slug } = await params;
  return toNextMetadata(await getRendererRouteMetadata(domain, slug));
}

export default async function CatchAllPage({
  params,
}: CatchAllPageProps) {
  const host = (await headers()).get("host") ?? "";

  if (!shouldRenderSiteForHost(host, domain)) {
    redirect(getRendererEngineRedirectUrl());
  }

  const { slug } = await params;
  return <SitePage slug={slug} />;
}
