export function isLikelyVisible(el: Element): boolean {
  const cs = getComputedStyle(el);
  if (cs.display === "none" || cs.visibility === "hidden" || (el as any).hidden)
    return false;
  return true;
}

export function isBoilerplate(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  if (["nav", "aside", "footer"].includes(tag)) return true;

  const cls = (el.className?.toString() || "").toLowerCase();
  if (
    cls.includes("cookie") ||
    cls.includes("consent") ||
    cls.includes("newsletter")
  )
    return true;

  return false;
}

export function isSectionBreak(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  if (tag === "article" || tag === "section") return true;
  if (/^h[1-6]$/.test(tag)) return true;
  return false;
}

export function isTextHost(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  if (
    [
      "p",
      "span",
      "li",
      "blockquote",
      "dd",
      "dt",
      "figcaption",
      "td",
      "th",
      "em",
      "strong",
      "a",
      "div",
    ].includes(tag)
  )
    return true;
  if (el.closest("header, nav, aside, footer")) return false;
  return true;
}
