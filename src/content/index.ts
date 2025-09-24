import { scheduleFlush } from "./buffer";
import {
  registerNavigation,
  registerClicks,
  registerInputs,
  registerScroll,
  registerFocus,
  registerVisibleText,
} from "./captures";

console.log("Loading content script...");

// boot
registerNavigation();
registerClicks();
registerInputs();
registerScroll();
registerFocus();
registerVisibleText();
scheduleFlush();

console.log("Content script loaded!");
