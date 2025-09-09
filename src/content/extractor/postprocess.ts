import { hashStable } from "../../shared/utils";
import type { ContentBlock } from "../../shared/types";
import type { RawBlock } from "./blocks";

export function postprocessBlocks(
  raw: RawBlock[],
  ctx: { url: string }
): ContentBlock[] {
  const seen = new Set<string>();
  const out: ContentBlock[] = [];

  let order = 0;
  for (const r of raw) {
    const text = r.text.trim();
    if (!text) continue;

    const path = r.sectionPath;
    const id = hashStable([ctx.url, path, text].join("•"));
    if (seen.has(id)) continue;
    seen.add(id);

    const rect = r.node.getBoundingClientRect();
    const hasValidBbox = isFinite(rect.top) && isFinite(rect.left);

    const block: ContentBlock = {
      blockId: id,
      pageUrl: ctx.url,
      sectionPath: path,
      text,
      order: order++,
    };

    if (hasValidBbox) {
      block.bbox = { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
    }

    out.push(block);
  }

  const MAX_BLOCKS = 2000;
  return out.length > MAX_BLOCKS ? out.slice(0, MAX_BLOCKS) : out;
}
