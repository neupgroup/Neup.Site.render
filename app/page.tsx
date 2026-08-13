import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SitePage from "@/data/neupkishor.com/page";
import {
  getRendererEngineRedirectUrl,
  shouldRenderSiteForHost,
} from "@/services/renderer/_index";

const domain = "neupkishor.com";

export default async function Home() {
  const host = (await headers()).get("host") ?? "";

  if (!shouldRenderSiteForHost(host, domain)) {
    redirect(getRendererEngineRedirectUrl());
  }

  return <SitePage slug={[]} />;
}
