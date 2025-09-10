// Small, pure utilities (no DOM/Chrome here)

export function hashStable(str: string): string {
  // Simple DJB2 variant (replace with xxhash/sha1 later if you want)
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return (h >>> 0).toString(16);
}

// Rough token estimator (chars/4)
export function estimateTokens(s: string): number {
  return Math.ceil(s.length / 4);
}

// Compact CSS path (best effort; stable enough for anchors)
export function cssPath(element: Element): string {
  if (element.id) return `#${cssEscape(element.id)}`;
  const parts: string[] = [];
  let cur: Element | null = element;
  while (cur && cur.nodeType === Node.ELEMENT_NODE && parts.length < 6) {
    const name = cur.tagName.toLowerCase();
    const nth = indexAmongType(cur);
    parts.unshift(nth > 1 ? `${name}:nth-of-type(${nth})` : name);
    cur = cur.parentElement;
  }
  return parts.join(">");
}

function indexAmongType(element: Element): number {
  const tag = element.tagName;
  let i = 0,
    idx = 0;
  for (const sib of element.parentElement?.children || []) {
    if ((sib as Element).tagName === tag) {
      i++;
      if (sib === element) idx = i;
    }
  }
  return idx || 1;
}

function cssEscape(id: string): string {
  // Minimal escape
  return id.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1");
}
