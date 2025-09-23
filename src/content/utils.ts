import type { EventPayload, EventType } from './types';
import { safePush } from './buffer';

export function now() {
  const d = new Date();
  return { ts_utc: d.getTime(), ts_iso: d.toISOString() };
}

export function emit(type: EventType, data: Record<string, unknown>) {
  const { ts_utc, ts_iso } = now();
  const e: EventPayload = {
    ts_utc, ts_iso,
    url: location.href,
    title: document.title || null,
    type, data,
  };
  safePush(e);
}

export function cssPath(el: Element): string {
  if (el.id) return `#${el.id}`;
  const parts: string[] = [];
  for (let e: Element | null = el; e && parts.length < 5; e = e.parentElement) {
    let s = e.tagName.toLowerCase();
    if (e.classList.length) s += '.' + [...e.classList].slice(0, 2).join('.');
    parts.unshift(s);
  }
  return parts.join(' > ');
}

export function maskInputValue(el: HTMLInputElement | HTMLTextAreaElement): string {
  const t = (el.type || '').toLowerCase();
  const val = el.value ?? '';
  const sensitive = /password|email|tel|number|search/i.test(t) || el.autocomplete === 'one-time-code';
  if (sensitive) return mask(val);
  return val.length > 64 ? val.slice(0, 61) + '...' : val;
}

function mask(s: string): string {
  if (!s) return '';
  const keep = Math.min(2, s.length);
  return s.slice(0, keep) + '*'.repeat(Math.max(0, s.length - keep));
}