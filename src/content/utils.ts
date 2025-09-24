import type { EventPayload, EventType } from "./types";
import { safePush } from "./buffer";

export function getTimestamps() {
  const date = new Date();
  return { ts_utc: date.getTime(), ts_iso: date.toISOString() };
}

export function emit(type: EventType, data: Record<string, unknown>) {
  const { ts_utc, ts_iso } = getTimestamps();
  const eventPayload: EventPayload = {
    ts_utc,
    ts_iso,
    url: location.href,
    title: document.title || null,
    type,
    data,
  };
  safePush(eventPayload);
}

export function cssPath(element: Element): string {
  if (element.id) return `#${element.id}`;
  const parts: string[] = [];
  for (
    let e: Element | null = element;
    e && parts.length < 5;
    e = e.parentElement
  ) {
    let s = e.tagName.toLowerCase();
    if (e.classList.length) s += "." + [...e.classList].slice(0, 2).join(".");
    parts.unshift(s);
  }
  return parts.join(" > ");
}

export function maskInputValue(
  element: HTMLInputElement | HTMLTextAreaElement,
): string {
  const t = (element.type || "").toLowerCase();
  const val = element.value ?? "";
  const sensitive =
    /password|email|tel|number|search/i.test(t) ||
    element.autocomplete === "one-time-code";
  if (sensitive) return mask(val);
  return val.length > 64 ? val.slice(0, 61) + "..." : val;
}

function mask(s: string): string {
  if (!s) return "";
  const keep = Math.min(2, s.length);
  return s.slice(0, keep) + "*".repeat(Math.max(0, s.length - keep));
}
