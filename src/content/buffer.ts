import { BATCH_MS, BATCH_SIZE, MAX_BUFFER } from "./config";
import type { EventPayload } from "./types";
import { getPort } from "./port";

const buf: EventPayload[] = [];
let flushTimer: number | null = null;

export function safePush(e: EventPayload) {
  if (buf.length >= MAX_BUFFER) buf.splice(0, buf.length - MAX_BUFFER + 1);
  buf.push(e);
  scheduleFlush();
}

export function scheduleFlush() {
  if (buf.length >= BATCH_SIZE) return flush();
  if (flushTimer != null) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    flush();
  }, BATCH_MS);
}

export function flush() {
  if (!buf.length) return;
  const batch = buf.splice(0, Math.min(buf.length, BATCH_SIZE));
  try {
    getPort().postMessage({ type: "batch", events: batch });
  } catch {
    /* retry later */
  }
}
