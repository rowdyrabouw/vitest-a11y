// vitest.setup.ts
import { expect } from "vitest";
import * as matchers from "vitest-axe/matchers";

// Extend vitest's expect with axe matchers
expect.extend(matchers);

// jsdom does not implement getComputedStyle for pseudo-elements (e.g. ::before).
// Some accessibility utilities still call it with a second argument.
const nativeGetComputedStyle = window.getComputedStyle.bind(window);

window.getComputedStyle = ((element: Element, pseudoElt?: string | null) => {
  if (pseudoElt) {
    return nativeGetComputedStyle(element);
  }

  return nativeGetComputedStyle(element);
}) as typeof window.getComputedStyle;
