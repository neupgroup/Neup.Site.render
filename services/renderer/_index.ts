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
  buttonLink: string;
  buttonTitle: string;
};

export type RendererPageContent = {
  componentProps: {
    button: RendererButtonProps;
  };
  domain: string;
  eyebrow: string;
  heading: string;
  summary: string;
  theme: RendererTheme;
  warnings: string[];
};

const dataRoot = path.join(process.cwd(), "data");

function getDomainDataDirectory(domain: string) {
  return path.join(dataRoot, domain);
}

async function readJsonFile(filePath: string) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as unknown;
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

export async function getRendererPageContent(
  domain: string,
): Promise<RendererPageContent> {
  const rendererData = await readRendererData(domain);

  return {
    componentProps: {
      button: {
        buttonLink: "https://neupkishor.com",
        buttonTitle: "Open Website",
      },
    },
    domain: rendererData.domain,
    eyebrow: "Renderer Service",
    heading: `Rendering ${rendererData.domain}`,
    summary:
      "This page is generated from the domain data files through the renderer service layer.",
    theme: rendererData.theme,
    warnings: rendererData.readErrors,
  };
}
