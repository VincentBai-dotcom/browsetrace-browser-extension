export function isLikelyVisible(element: Element): boolean {
  const cs = getComputedStyle(element);
  if (
    cs.display === "none" ||
    cs.visibility === "hidden" ||
    (element as any).hidden
  ) {
    return false;
  }
  return true;
}

export function isBoilerplate(element: Element): boolean {
  const tag = element.tagName.toLowerCase();
  if (["nav", "aside", "footer"].includes(tag)) return true;

  const cls = (element.className?.toString() || "").toLowerCase();
  if (
    cls.includes("cookie") ||
    cls.includes("consent") ||
    cls.includes("newsletter")
  )
    return true;

  return false;
}

export function isSectionBreak(element: Element): boolean {
  const tag = element.tagName.toLowerCase();
  if (tag === "article" || tag === "section") return true;
  if (/^h[1-6]$/.test(tag)) return true;
  return false;
}

export function isTextHost(element: Element): boolean {
  const tag = element.tagName.toLowerCase();
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
  if (element.closest("header, nav, aside, footer")) return false;
  return true;
}
