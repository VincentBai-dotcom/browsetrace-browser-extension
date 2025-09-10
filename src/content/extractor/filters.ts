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

export function isSemanticContentElement(element: Element): boolean {
  const tag = element.tagName.toLowerCase();

  // Content-bearing semantic elements
  const contentTags = [
    "article",
    "section",
    "main",
    "aside",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "blockquote",
    "pre",
    "code",
    "ul",
    "ol",
    "li",
    "dl",
    "dt",
    "dd",
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th",
    "figure",
    "figcaption",
    "details",
    "summary",
  ];

  return contentTags.includes(tag);
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
