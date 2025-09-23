import { emit, cssPath, maskInputValue } from './utils';

// navigation + SPA changes
export function registerNavigation() {
  let last = location.href;
  emit('navigate', { from: null, to: last });

  const _push = history.pushState;
  history.pushState = function (...args) {
    _push.apply(this, args as any);
    const to = location.href;
    if (to !== last) emit('navigate', { from: last, to });
    last = to;
  };
  addEventListener('popstate', () => {
    const to = location.href;
    emit('navigate', { from: last, to });
    last = to;
  });
}

// clicks
export function registerClicks() {
  addEventListener('click', (e) => {
    const t = e.target as Element | null;
    if (!t) return;
    const selector = cssPath(t);
    const text = (t as HTMLElement).innerText?.slice(0, 120) ?? '';
    emit('click', { selector, text });
  }, { capture: true });
}

// inputs (masked)
export function registerInputs() {
  addEventListener('input', (e) => {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement | null;
    if (!t) return;
    emit('input', { selector: cssPath(t), value: maskInputValue(t) });
  }, { capture: true });
}

// scroll (throttled)
export function registerScroll() {
  let last = 0;
  addEventListener('scroll', () => {
    const n = performance.now();
    if (n - last > 250) { last = n; emit('scroll', { y: scrollY | 0 }); }
  }, { passive: true });
}

// focus/blur
export function registerFocus() {
  addEventListener('focus', () => emit('focus', { state: 'focused' }), true);
  addEventListener('blur',  () => emit('focus', { state: 'blurred' }), true);
}

// visible text (light snapshot)
export function registerVisibleText() {
  const snap = () => {
    const text = document.body?.innerText?.slice(0, 4000) ?? '';
    if (text.trim()) emit('visible_text', { text });
  };
  addEventListener('DOMContentLoaded', snap);
  addEventListener('load', snap);
}
