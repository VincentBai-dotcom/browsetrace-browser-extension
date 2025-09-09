import type { PageCapture } from "../../shared/types";
import { extractPage } from "../extractor/extractPage";

let pending = false;
const DEBOUNCE_MS = 1000;
let observer: MutationObserver | null = null;

export function startExtractor() {
  if (observer) return;
  observer = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    setTimeout(async () => {
      pending = false;
      const capture = await extractPage();
      chrome.runtime.sendMessage({ type: "PAGE_CAPTURE", payload: capture });
    }, DEBOUNCE_MS);
  });

  observer.observe(document, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
  });

  // initial capture
  extractPage().then((capture: PageCapture) => {
    chrome.runtime.sendMessage({ type: "PAGE_CAPTURE", payload: capture });
  });
}

export function stopExtractor() {
  observer?.disconnect();
  observer = null;
}
