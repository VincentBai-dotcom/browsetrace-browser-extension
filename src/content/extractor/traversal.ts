import { cssPath } from "../../shared/utils"; // adjust path if you use TS paths
import {
  isLikelyVisible,
  isBoilerplate,
  isTextHost,
  isSemanticContentElement,
} from "./filters";
import type { RawBlock } from "./blocks";

export function extractBlocksFromDOM(scope: Element, sink: RawBlock[]) {
  // Step 1: Create a cleaned content tree
  const contentTree = pruneToContentElements(scope);
  if (!contentTree) return;

  // Step 2: Extract text blocks from the cleaned tree
  const textBlocks = extractTextBlocks(contentTree);

  // Step 3: Convert to RawBlocks
  let order = 0;
  for (const block of textBlocks) {
    if (block.text.length >= 200) {
      // min length check
      sink.push({
        node: block.element,
        sectionPath: cssPath(block.element),
        text: block.text,
        orderHint: order++,
      });
    }
  }
}

function pruneToContentElements(element: Element): Element | null {
  // Skip invisible or boilerplate elements entirely
  if (!isLikelyVisible(element) || isBoilerplate(element)) {
    return null;
  }

  // Clone the element
  const cloned = element.cloneNode(false) as Element;

  // Process children
  for (const child of Array.from(element.children)) {
    const prunedChild = pruneToContentElements(child);
    if (prunedChild) {
      cloned.appendChild(prunedChild);
    }
  }

  // Keep text content
  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      cloned.appendChild(node.cloneNode(true));
    }
  }

  // Only keep elements that either:
  // 1. Have meaningful text content, OR
  // 2. Are semantic content containers, OR
  // 3. Have content-bearing children
  const hasTextContent =
    !!cloned.textContent && cloned.textContent.trim().length > 0;
  const isContentContainer = isSemanticContentElement(cloned);
  const hasChildren = cloned.children.length > 0;

  if (hasTextContent || isContentContainer || hasChildren) {
    return cloned;
  }

  return null;
}

function extractTextBlocks(
  element: Element
): Array<{ element: Element; text: string }> {
  const blocks: Array<{ element: Element; text: string }> = [];

  // If this element has significant direct text content, it's a block
  const directText = getDirectTextContent(element);
  if (directText.length >= 50) {
    // minimum meaningful text
    blocks.push({ element, text: directText });
    return blocks; // Don't recurse if we found text here
  }

  // Otherwise, recurse into children
  for (const child of Array.from(element.children)) {
    blocks.push(...extractTextBlocks(child));
  }

  return blocks;
}

function getDirectTextContent(element: Element): string {
  // Get text content but normalize whitespace
  return element.textContent?.replace(/\s+/g, " ").trim() || "";
}

function chunkParagraphs(
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
