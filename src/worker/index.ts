import type { EventPayload } from "../shared/types";

// Background script for BrowseTrace extension
console.log("BrowseTrace background script loaded");

// Change this to your local collector (port/path can be anything you run)
const ENDPOINT = "http://127.0.0.1:8123/events";

/**
 * Forward events to your local daemon.
 * - Uses mode: "no-cors" so you don't need to set up CORS on the daemon.
 * - We omit Content-Type so the browser will send an opaque request; the body
 *   is still the JSON string (server should parse it as JSON even if header is missing).
 */
async function sendToLocalhost(payload: { events: EventPayload[] }) {
  try {
    console.log(payload);
    await fetch(ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      // Don’t set non-simple headers with no-cors; just send the JSON string.
      body: JSON.stringify(payload),
      // keepalive is ignored in SW, but harmless:
      keepalive: true,
    });
  } catch (e) {
    console.log(`Failed to send to Local host due to ${e}`);
  }
}

// Accept a long-lived Port from content scripts.
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "events") return;

  port.onMessage.addListener((msg) => {
    // Expect either { type: "event", event: {...} } or
    // { type: "batch", events: [...] } — send as-is with a minimal wrapper.
    if (msg?.type === "batch" && Array.isArray(msg.events)) {
      sendToLocalhost({ events: msg.events });
    } else if (msg?.type === "event" && msg.event) {
      sendToLocalhost({ events: [msg.event] });
    }
  });
});
