export type RendererTheme = {
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  surface: string;
};

export const defaultRendererTheme: RendererTheme = {
  accent: "#2563eb",
  background: "#f8fafc",
  foreground: "#0f172a",
  muted: "#64748b",
  surface: "#ffffff",
};

function readStringField(
  source: Record<string, unknown>,
  key: keyof RendererTheme,
  fallback: string,
) {
  const value = source[key];
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
}

export function normalizeRendererTheme(source: unknown): RendererTheme {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return defaultRendererTheme;
  }

  const record = source as Record<string, unknown>;

  return {
    accent: readStringField(record, "accent", defaultRendererTheme.accent),
    background: readStringField(
      record,
      "background",
      defaultRendererTheme.background,
    ),
    foreground: readStringField(
      record,
      "foreground",
      defaultRendererTheme.foreground,
    ),
    muted: readStringField(record, "muted", defaultRendererTheme.muted),
    surface: readStringField(record, "surface", defaultRendererTheme.surface),
  };
}
