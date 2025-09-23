import { scheduleFlush } from './buffer';
import {
  registerNavigation, registerClicks, registerInputs,
  registerScroll, registerFocus, registerVisibleText
} from './captures';

// boot
registerNavigation();
registerClicks();
registerInputs();
registerScroll();
registerFocus();
registerVisibleText();
scheduleFlush();
