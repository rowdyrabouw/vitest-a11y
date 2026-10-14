import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import * as axeMatchers from "vitest-axe/matchers";

export const AXE_REPORT_PATH = "dist/axe-report.html";

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

function renderViolation(violation) {
  const nodes = violation.nodes
    .map(
      (node) => `
        <li class="node">
          <p><strong>Target:</strong> <code>${escapeHtml(node.target.join(", "))}</code></p>
          <p>${escapeHtml(node.failureSummary || "No failure summary provided.")}</p>
          <pre><code>${escapeHtml(node.html)}</code></pre>
        </li>
      `,
    )
    .join("");

  return `
    <section class="violation">
      <h2>${escapeHtml(violation.help)} <code>${escapeHtml(violation.id)}</code></h2>
      <p><strong>Impact:</strong> ${escapeHtml(violation.impact || "unknown")}</p>
      <p>${escapeHtml(violation.description)}</p>
      <p><strong>Tags:</strong> ${escapeHtml(violation.tags.join(", "))}</p>
      <p><a href="${escapeHtml(violation.helpUrl)}" rel="noreferrer">Learn how to fix this</a></p>
      <h3>Affected elements (${violation.nodes.length})</h3>
      <ul>${nodes}</ul>
    </section>
  `;
}

function renderReport(results) {
  const violations = results.violations;
  if (!Array.isArray(violations)) {
    throw new TypeError("Expected axe results to include a violations array.");
  }

  const violationCount = violations.length;
  const nodeCount = violations.reduce(
    (total, violation) => total + violation.nodes.length,
    0,
  );
  const status =
    violationCount === 0
      ? '<p class="status passed">No accessibility violations found.</p>'
      : `<p class="status failed">${violationCount} violation${violationCount === 1 ? "" : "s"} found across ${nodeCount} affected element${nodeCount === 1 ? "" : "s"}.</p>`;
  const details =
    violations.map(renderViolation).join("\n") ||
    '<p class="empty">The scanned component passed the accessibility checks.</p>';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Accessibility report</title>
    <style>
      :root { color-scheme: light; font: 16px/1.5 system-ui, sans-serif; color: #202124; background: #f5f7fa; }
      body { max-width: 960px; margin: 0 auto; padding: 2rem; }
      h1, h2, h3 { line-height: 1.2; }
      .status, .violation { padding: 1rem 1.25rem; border-radius: .5rem; background: white; }
      .passed { border-left: .4rem solid #16803c; }
      .failed { border-left: .4rem solid #b42318; }
      .violation { margin: 1.25rem 0; border: 1px solid #d0d5dd; }
      .node { margin: 1rem 0; }
      code, pre { overflow-wrap: anywhere; }
      pre { padding: 1rem; overflow-x: auto; background: #f1f3f5; border-radius: .25rem; }
      a { color: #175cd3; }
      .empty { color: #475467; }
    </style>
  </head>
  <body>
    <main>
      <h1>Accessibility report</h1>
      <p>Generated from the axe-core results for this Vitest run.</p>
      ${status}
      <h2>Violations</h2>
      ${details}
    </main>
  </body>
</html>
`;
}

export function createAxeHtmlReporter({
  outputFile = AXE_REPORT_PATH,
} = {}) {
  return {
    ...axeMatchers,
    toHaveNoViolations(results) {
      const reportPath = path.resolve(process.cwd(), outputFile);
      mkdirSync(path.dirname(reportPath), { recursive: true });
      writeFileSync(reportPath, renderReport(results), "utf8");

      return axeMatchers.toHaveNoViolations(results);
    },
  };
}

export function createAxeHtmlOpenReporter({
  outputFile = AXE_REPORT_PATH,
} = {}) {
  return {
    onTestRunEnd() {
      const reportPath = path.resolve(process.cwd(), outputFile);
      const opener =
        process.platform === "darwin"
          ? "open"
          : process.platform === "win32"
            ? "explorer"
            : "xdg-open";

      const result = spawnSync(opener, [reportPath], { stdio: "ignore" });
      if (result.error) {
        console.error(`Could not open the axe report at ${reportPath}.`, result.error);
      } else if (result.status !== 0) {
        console.error(
          `Could not open the axe report at ${reportPath} (exit code ${result.status}).`,
        );
      }
    },
  };
}
