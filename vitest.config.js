// vitest.config.ts
import { defineConfig } from "vitest/config";
import {
  AXE_REPORT_PATH,
  createAxeHtmlOpenReporter,
} from "./vitest-axe-html-reporter.js";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    reporters: [
      "default",
      createAxeHtmlOpenReporter({ outputFile: AXE_REPORT_PATH }),
    ],
  },
});
