import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "../demo-component.js";
import { configureAxe } from "vitest-axe";

describe("DemoComponent", () => {
  let element;

  // create the element and append it to the DOM before the test
  beforeEach(() => {
    element = document.createElement("demo-component");
    document.body.appendChild(element);
  });

  // clean up the DOM after the test
  afterEach(() => {
    document.body.removeChild(element);
  });

  it("should have no accessibility violations", async () => {
    const form = element.shadowRoot.querySelector("form");
    const axe = configureAxe({
      rules: {
        // disable landmark rules when testing isolated components.
        region: { enabled: false },
      },
    });

    const results = await axe(form);

    expect(results).toHaveNoViolations();
  });
});
