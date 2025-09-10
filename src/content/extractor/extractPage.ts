import type { PageCapture } from "../../shared/types";
import type { RawBlock } from "./blocks";
import { collectMetadata } from "./metadata";
import { postprocessBlocks } from "./postprocess";
import { extractBlocksFromDOM } from "./traversal";

export async function extractPage(): Promise<PageCapture> {
  const now = Date.now();
  const url = location.href;
  const domain = location.hostname;
  const title = document.title || "";
  const lang = document.documentElement.lang || undefined;

  const meta = collectMetadata();

  const rawBlocks: RawBlock[] = [];
  // Start from a single scope root; shadow DOM handled inside extractBlocksFromDOM
  const scope = pickScopeRoot(document);
  if (scope) {
    extractBlocksFromDOM(scope, rawBlocks);
  }

  const blocks = postprocessBlocks(rawBlocks, { url });

  return {
    url,
    domain,
    title,
    capturedAt: now,
    lang: lang ?? "",
    meta,
    blocks,
  };
}

function pickScopeRoot(doc: Document): Element | null {
  return (
    doc.querySelector<HTMLElement>("main, [role='main']") ??
    doc.body ??
    doc.documentElement ??
    null
  );
}
