// vitest.setup.ts
import { expect } from "vitest";
import {
  AXE_REPORT_PATH,
  createAxeHtmlReporter,
} from "./vitest-axe-html-reporter.js";

expect.extend(createAxeHtmlReporter({ outputFile: AXE_REPORT_PATH }));

// jsdom does not implement getComputedStyle for pseudo-elements (e.g. ::before).
// Some accessibility utilities still call it with a second argument.
const nativeGetComputedStyle = window.getComputedStyle.bind(window);

window.getComputedStyle = ((element: Element, pseudoElt?: string | null) => {
  if (pseudoElt) {
    return nativeGetComputedStyle(element);
  }

  return nativeGetComputedStyle(element);
}) as typeof window.getComputedStyle;
