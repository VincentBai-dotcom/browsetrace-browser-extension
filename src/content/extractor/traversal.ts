import { cssPath } from "../../shared/utils"; // adjust path if you use TS paths
import {
  isLikelyVisible,
  isBoilerplate,
  isTextHost,
  isSemanticSection,
} from "./filters";
import type { RawBlock } from "./blocks";

export function extractBlocksFromDOM(scope: Element, sink: RawBlock[]) {
  // Skip invisible/boilerplate roots early
  if (!isLikelyVisible(scope)) return;

  let order = 0;

  // Single segmentation pass (no shadow root handling)
  const sections = sectionize(scope);
  for (const sec of sections) {
    const paragraphs = collectParagraphs(sec);
    const chunks = chunkParagraphs(paragraphs, {
      maxChars: 1200,
      minChars: 200,
    });

    for (const text of chunks) {
      if (!text) continue;
      sink.push({
        node: sec,
        sectionPath: cssPath(sec),
        text,
        orderHint: order++,
      });
    }
  }
}

function sectionize(container: Element): Element[] {
  const sections: Element[] = [];

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (element: Element) => {
      if (!isLikelyVisible(element)) return NodeFilter.FILTER_SKIP;
      if (isBoilerplate(element)) return NodeFilter.FILTER_SKIP;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  while (walker.nextNode()) {
    const element = walker.currentNode as Element;
    if (isSemanticSection(element)) {
      sections.push(element);
    }
  }

  // Fallback: if no semantic sections found, use the container
  if (!sections.length) sections.push(container);
  return sections.slice(0, 200);
}

export function collectParagraphs(section: Element): string[] {
  const parts: string[] = [];
  const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, {
    acceptNode: (n: Node) => {
      const p = n.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      if (!isTextHost(p)) return NodeFilter.FILTER_REJECT;
      if (!isLikelyVisible(p)) return NodeFilter.FILTER_REJECT;
      const t = n.textContent?.trim();
      if (!t) return NodeFilter.FILTER_REJECT;
      if (t.length < 2) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const buffer: string[] = [];
  while (walker.nextNode()) {
    buffer.push(
      (walker.currentNode.textContent || "").replace(/\s+/g, " ").trim()
    );
  }

  const merged = buffer
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (merged) parts.push(merged);
  return parts;
}

export function chunkParagraphs(
  paras: string[],
  opts: { maxChars: number; minChars: number }
): string[] {
  const { maxChars, minChars } = opts;
  const out: string[] = [];
  let cur = "";

  for (const p of paras) {
    if ((cur + " " + p).length <= maxChars) {
      cur = cur ? cur + " " + p : p;
    } else {
      if (cur.length >= minChars) out.push(cur);
      if (p.length > maxChars) {
        for (let i = 0; i < p.length; i += maxChars)
          out.push(p.slice(i, i + maxChars));
        cur = "";
      } else {
        cur = p;
      }
    }
  }
  if (cur.length >= Math.min(80, minChars)) out.push(cur);
  return out;
}
