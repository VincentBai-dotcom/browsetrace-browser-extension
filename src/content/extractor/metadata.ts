export function collectMetadata(): Record<string, string | string[]> {
  const meta: Record<string, string | string[]> = {};
  const get = (sel: string) =>
    document.querySelector<HTMLMetaElement>(sel)?.content?.trim();

  meta.description = get("meta[name='description']") || "";
  meta.keywords = get("meta[name='keywords']") || "";
  meta.ogTitle = get("meta[property='og:title']") || "";
  meta.ogDesc = get("meta[property='og:description']") || "";
  meta.canonical =
    document.querySelector<HTMLLinkElement>("link[rel='canonical']")?.href ||
    location.href;

  return meta;
}

export function collectStructuredData(): unknown[] {
  const out: unknown[] = [];
  for (const s of document.querySelectorAll<HTMLScriptElement>(
    'script[type="application/ld+json"]'
  )) {
    try {
      const json = JSON.parse(s.textContent || "null");
      if (json) out.push(json);
    } catch {
      /* ignore */
    }
  }
  return out;
}
