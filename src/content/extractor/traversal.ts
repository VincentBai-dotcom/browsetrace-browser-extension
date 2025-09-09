import { cssPath } from "../../shared/utils"; // adjust path if you use TS paths
import {
  isLikelyVisible,
  isBoilerplate,
  isSectionBreak,
  isTextHost,
} from "./filters";
import type { RawBlock } from "./blocks";

export function extractBlocksFromDOM(
  root: Document | Element,
  sink: RawBlock[]
) {
  const containers = pickContentContainers(root);

  let order = 0;
  for (const container of containers) {
    const sections = sectionize(container);
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
}

export function pickContentContainers(root: Document | Element): Element[] {
  const list = [
    ...(root instanceof Document
      ? Array.from(root.querySelectorAll("main, article"))
      : [root]),
  ];
  if (!list.length && root instanceof Document && root.body)
    list.push(root.body);
  return list.filter(isLikelyVisible).slice(0, 8);
}

export function sectionize(container: Element): Element[] {
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
    if (isSectionBreak(element)) sections.push(element);
  }

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

export function discoverShadowRoots(root: Element, acc: Node[]) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  while (walker.nextNode()) {
    const element = walker.currentNode as Element;
    const shadowRoot = (element as any).shadowRoot as ShadowRoot | null;
    if (shadowRoot) {
      acc.push(shadowRoot);
      discoverShadowRoots(shadowRoot as unknown as Element, acc);
    }
  }
}
