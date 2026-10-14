# Demo code for Accessibility Testing with Vitest

This repository contains demo code for accessibility testing using Vitest. It includes examples of how to set up and run accessibility tests on components to ensure they meet accessibility standards.

## Getting Started

To get started with the accessibility testing code, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/rowdyrabouw/vitest-a11y.git
   ```
2. Navigate to the project directory:
   ```bash
   cd vitest-a11y
   ```
3. Install the dependencies:

   ```bash
   pnpm install
   ```

4. Start the local server if you want to see the component:

   ```bash
   pnpm start
   ```

5. Run the accessibility tests:

   ```bash
   pnpm test
   ```

Each `toHaveNoViolations()` assertion also writes an axe report to
`dist/axe-report.html`. The report includes a summary and details for every
violation, including its affected element, selector, impact, and axe help link.
The report is generated and opened automatically after the test run, even when
violations cause a test to fail. To change the output path, update
`AXE_REPORT_PATH` in `vitest-axe-html-reporter.js`.
