import type { PageCapture } from "../../shared/types";
import type { RawBlock } from "./blocks";
import { collectMetadata, collectStructuredData } from "./metadata";
import { postprocessBlocks } from "./postprocess";
import { discoverShadowRoots, extractBlocksFromDOM } from "./traversal";

export async function extractPage(): Promise<PageCapture> {
  const now = Date.now();
  const url = location.href;
  const domain = location.hostname;
  const title = document.title || "";
  const lang = document.documentElement.lang || undefined;

  const meta = collectMetadata();
  const schemaOrg = collectStructuredData();

  const roots: Node[] = [document];
  discoverShadowRoots(document.documentElement, roots);

  const rawBlocks: RawBlock[] = [];
  for (const root of roots) {
    extractBlocksFromDOM(root as Document | Element, rawBlocks);
  }

  const blocks = postprocessBlocks(rawBlocks, { url });

  return {
    url,
    domain,
    title,
    capturedAt: now,
    lang: lang ?? "",
    meta,
    schemaOrg,
    blocks,
  };
}
