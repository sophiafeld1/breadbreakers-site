export type ParsedSubstackUrl = {
  url: string;
  slug: string;
};

export function parseSubstackPostUrl(raw: string): ParsedSubstackUrl | null {
  try {
    const parsed = new URL(raw.trim());

    if (parsed.protocol !== "https:") {
      return null;
    }

    if (!parsed.hostname.toLowerCase().endsWith("substack.com")) {
      return null;
    }

    const match = parsed.pathname.match(/^\/p\/([a-z0-9-]+)\/?$/i);

    if (!match) {
      return null;
    }

    const slug = match[1].toLowerCase();

    return {
      url: `${parsed.origin}/p/${slug}`,
      slug,
    };
  } catch {
    return null;
  }
}

export function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function fetchSubstackTitle(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const ogTitle =
      html.match(
        /<meta[^>]+property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i,
      ) ??
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:title["'][^>]*>/i,
      );

    const title = ogTitle?.[1]?.trim();
    return title || null;
  } catch {
    return null;
  }
}
