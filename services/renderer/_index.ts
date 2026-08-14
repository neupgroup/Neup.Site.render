import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  defaultRendererTheme,
  normalizeRendererTheme,
  type RendererTheme,
} from "./theme";

export type RendererDataFile = {
  data: unknown;
  name: string;
};

export type RendererDomainData = {
  domain: string;
  files: Record<string, RendererDataFile>;
  readErrors: string[];
  theme: RendererTheme;
};

export type RendererButtonProps = {
  variant?: "primary" | "secondary";
  buttonLink: string;
  buttonTitle: string;
};

export type RendererLink = {
  href: string;
  label: string;
};

export type RendererTextBlock = {
  description: string;
  title: string;
};

export type RendererStat = {
  label: string;
  value: string;
};

export type RendererBlogSection = {
  body: string;
  title: string;
};

export type RendererBlogPost = {
  category: string;
  description: string;
  hero: string;
  publishedAt: string;
  readingTime: string;
  sections: RendererBlogSection[];
  slug: string;
  title: string;
};

export type RendererPageContent = {
  componentProps: {
    button: RendererButtonProps;
    secondaryButton: RendererButtonProps;
  };
  domain: string;
  eyebrow: string;
  heading: string;
  highlights: string[];
  navigation: RendererLink[];
  process: string[];
  profile: {
    email: string;
    location: string;
    name: string;
    role: string;
    socials: RendererLink[];
    tagline: string;
  };
  proof: string[];
  services: RendererTextBlock[];
  stats: RendererStat[];
  summary: string;
  theme: RendererTheme;
  warnings: string[];
};

export type RendererSiteManifest = {
  description: string;
  domain: string;
  favicon: string;
  locale: string;
  name: string;
  title: string;
};

export type RendererRouteMetadata = {
  canonicalPath: string;
  description: string;
  domain: string;
  faviconPath: string;
  locale: string;
  name: string;
  title: string;
};

const dataRoot = path.join(process.cwd(), "data");
const rendererEngineRedirectUrl = "https://neupgroup.com/site";

function getDomainDataDirectory(domain: string) {
  return path.join(dataRoot, domain);
}

function normalizeHost(host: string) {
  return host.toLowerCase().split(":")[0] ?? "";
}

export function shouldRenderSiteForHost(host: string, domain: string) {
  const normalizedHost = normalizeHost(host);
  const normalizedDomain = normalizeHost(domain);

  return (
    normalizedHost === normalizedDomain ||
    normalizedHost === `www.${normalizedDomain}`
  );
}

export function getRendererEngineRedirectUrl() {
  return rendererEngineRedirectUrl;
}

async function readJsonFile(filePath: string) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as unknown;
}

function asRecord(source: unknown) {
  return source && typeof source === "object" && !Array.isArray(source)
    ? (source as Record<string, unknown>)
    : {};
}

function readString(source: Record<string, unknown>, key: string) {
  const value = source[key];
  return typeof value === "string" && value.trim().length > 0
    ? value
    : undefined;
}

function readStringArray(source: Record<string, unknown>, key: string) {
  const value = source[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function readLinks(source: unknown) {
  return Array.isArray(source)
    ? source
        .map((item) => {
          const record = asRecord(item);
          const href = readString(record, "href");
          const label = readString(record, "label");

          return href && label ? { href, label } : undefined;
        })
        .filter((item): item is RendererLink => Boolean(item))
    : [];
}

function readTextBlocks(source: unknown) {
  return Array.isArray(source)
    ? source
        .map((item) => {
          const record = asRecord(item);
          const title = readString(record, "title");
          const description = readString(record, "description");

          return title && description ? { title, description } : undefined;
        })
        .filter((item): item is RendererTextBlock => Boolean(item))
    : [];
}

function readStats(source: unknown) {
  return Array.isArray(source)
    ? source
        .map((item) => {
          const record = asRecord(item);
          const label = readString(record, "label");
          const value = readString(record, "value");

          return label && value ? { label, value } : undefined;
        })
        .filter((item): item is RendererStat => Boolean(item))
    : [];
}

function readBlogSections(source: unknown) {
  return Array.isArray(source)
    ? source
        .map((item) => {
          const record = asRecord(item);
          const title = readString(record, "title");
          const body = readString(record, "body");

          return title && body ? { title, body } : undefined;
        })
        .filter((item): item is RendererBlogSection => Boolean(item))
    : [];
}

function readBlogPosts(source: unknown) {
  return Array.isArray(source)
    ? source
        .map((item) => {
          const record = asRecord(item);
          const slug = readString(record, "slug");
          const title = readString(record, "title");
          const description = readString(record, "description");

          if (!slug || !title || !description) {
            return undefined;
          }

          return {
            category: readString(record, "category") ?? "Writing",
            description,
            hero: readString(record, "hero") ?? description,
            publishedAt: readString(record, "publishedAt") ?? "",
            readingTime: readString(record, "readingTime") ?? "Read",
            sections: readBlogSections(record.sections),
            slug,
            title,
          };
        })
        .filter((item): item is RendererBlogPost => Boolean(item))
    : [];
}

function getManifestData(
  files: Record<string, RendererDataFile>,
  domain: string,
): RendererSiteManifest {
  const manifest = asRecord(files.manifest?.data);
  const page = getPageData(files, domain);

  return {
    description:
      readString(manifest, "description") ?? page.summary,
    domain: readString(manifest, "domain") ?? domain,
    favicon: readString(manifest, "favicon") ?? "favicon.ico",
    locale: readString(manifest, "locale") ?? "en",
    name: readString(manifest, "name") ?? page.name,
    title:
      readString(manifest, "title") ??
      `${page.name} - ${page.role}`,
  };
}

function getPageData(files: Record<string, RendererDataFile>, domain: string) {
  const page = asRecord(files.page?.data);
  const hero = asRecord(page.hero);
  const cta = asRecord(page.cta);
  const secondaryCta = asRecord(page.secondaryCta);
  const profile = asRecord(files.profile?.data);

  return {
    buttonLink: readString(cta, "buttonLink") ?? `https://${domain}`,
    buttonTitle: readString(cta, "buttonTitle") ?? "Open Website",
    email: readString(profile, "email") ?? `hello@${domain}`,
    eyebrow: readString(hero, "eyebrow") ?? "Renderer Service",
    heading: readString(hero, "heading") ?? `Rendering ${domain}`,
    highlights: readStringArray(page, "highlights"),
    location: readString(profile, "location") ?? "Remote",
    name: readString(profile, "name") ?? domain,
    navigation: readLinks(files.navigation?.data),
    process: readStringArray(page, "process"),
    profileTagline: readString(profile, "tagline") ?? "",
    proof: readStringArray(page, "proof"),
    role: readString(profile, "role") ?? "Developer",
    secondaryButtonLink: readString(secondaryCta, "buttonLink") ?? "#offer",
    secondaryButtonTitle: readString(secondaryCta, "buttonTitle") ?? "Learn More",
    services: readTextBlocks(page.services),
    socials: readLinks(profile.socials),
    stats: readStats(page.stats),
    summary:
      readString(hero, "summary") ??
      "This page is generated from the domain data files through the renderer service layer.",
  };
}

export async function readRendererData(
  domain: string,
): Promise<RendererDomainData> {
  const directory = getDomainDataDirectory(domain);
  const files: Record<string, RendererDataFile> = {};
  const readErrors: string[] = [];

  let entries: string[] = [];

  try {
    entries = await readdir(directory);
  } catch {
    return {
      domain,
      files,
      readErrors: [`No renderer data directory found for ${domain}.`],
      theme: defaultRendererTheme,
    };
  }

  await Promise.all(
    entries
      .filter((entry) => entry.endsWith(".json"))
      .map(async (entry) => {
        const name = entry.replace(/\.json$/, "");

        try {
          files[name] = {
            data: await readJsonFile(path.join(directory, entry)),
            name,
          };
        } catch {
          readErrors.push(`Unable to read ${domain}/${entry} as valid JSON.`);
        }
      }),
  );

  return {
    domain,
    files,
    readErrors,
    theme: normalizeRendererTheme(files.theme?.data),
  };
}

export async function readRendererAsset(domain: string, assetName: string) {
  const normalizedAssetName = path.basename(assetName);
  const assetPath = path.join(getDomainDataDirectory(domain), normalizedAssetName);

  return readFile(assetPath);
}

export async function getRendererSiteManifest(
  domain: string,
): Promise<RendererSiteManifest> {
  const rendererData = await readRendererData(domain);
  return getManifestData(rendererData.files, rendererData.domain);
}

export async function getRendererRouteMetadata(
  domain: string,
  slug: string[],
): Promise<RendererRouteMetadata> {
  const rendererData = await readRendererData(domain);
  const manifest = getManifestData(rendererData.files, rendererData.domain);
  const blogs = readBlogPosts(rendererData.files.blogs?.data);
  const normalizedSlug = slug.filter(Boolean);
  const canonicalPath = normalizedSlug.length
    ? `/${normalizedSlug.join("/")}`
    : "/";

  if (normalizedSlug.length === 1 && normalizedSlug[0] === "blogs") {
    return {
      ...manifest,
      canonicalPath,
      faviconPath: "/favicon.ico",
      title: `${manifest.name} - Blogs`,
      description: `Writing and notes from ${manifest.name}.`,
    };
  }

  if (normalizedSlug.length === 2 && normalizedSlug[0] === "blogs") {
    const blog = blogs.find((item) => item.slug === normalizedSlug[1]);

    if (blog) {
      return {
        ...manifest,
        canonicalPath,
        faviconPath: "/favicon.ico",
        title: `${blog.title} - ${manifest.name}`,
        description: blog.description,
      };
    }
  }

  return {
    ...manifest,
    canonicalPath,
    faviconPath: "/favicon.ico",
  };
}

export async function getRendererPageContent(
  domain: string,
): Promise<RendererPageContent> {
  const rendererData = await readRendererData(domain);
  const page = getPageData(rendererData.files, rendererData.domain);

  return {
    componentProps: {
      button: {
        buttonLink: page.buttonLink,
        buttonTitle: page.buttonTitle,
      },
      secondaryButton: {
        buttonLink: page.secondaryButtonLink,
        buttonTitle: page.secondaryButtonTitle,
        variant: "secondary",
      },
    },
    domain: rendererData.domain,
    eyebrow: page.eyebrow,
    heading: page.heading,
    highlights: page.highlights,
    navigation: page.navigation,
    process: page.process,
    profile: {
      email: page.email,
      location: page.location,
      name: page.name,
      role: page.role,
      socials: page.socials,
      tagline: page.profileTagline,
    },
    proof: page.proof,
    services: page.services,
    stats: page.stats,
    summary: page.summary,
    theme: rendererData.theme,
    warnings: rendererData.readErrors,
  };
}

export async function getRendererBlogsContent(domain: string) {
  const rendererData = await readRendererData(domain);

  return {
    blogs: readBlogPosts(rendererData.files.blogs?.data),
    domain: rendererData.domain,
    theme: rendererData.theme,
    warnings: rendererData.readErrors,
  };
}

export async function getRendererBlogPostContent(domain: string, slug: string) {
  const blogsContent = await getRendererBlogsContent(domain);
  const blog = blogsContent.blogs.find((item) => item.slug === slug);

  return {
    ...blogsContent,
    blog,
  };
}

export async function getRendererBlogStaticParams(domain: string) {
  const blogsContent = await getRendererBlogsContent(domain);
  return blogsContent.blogs.map((blog) => ({ slug: blog.slug }));
}
