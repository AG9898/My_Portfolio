/**
 * Usage:
 * 1) Start the dev server first: npm run dev
 * 2) Run: npm run export:cv
 *
 * If Next chooses a port other than 3000, pass it explicitly:
 * CV_EXPORT_ORIGIN=http://localhost:3001 npm run export:cv
 */

const path = require("node:path");
const puppeteer = require("puppeteer");

const CV_EXPORT_ORIGIN = process.env.CV_EXPORT_ORIGIN ?? "http://localhost:3000";
const CV_PRINT_URL = new URL("/cv?print=1", CV_EXPORT_ORIGIN).toString();
const OUTPUT_PATH = path.resolve(process.cwd(), "public/cv.pdf");

async function exportCvPdf() {
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1800 });
    await page.goto(CV_PRINT_URL, {
      waitUntil: "networkidle0",
      timeout: 60_000,
    });
    await page.waitForSelector("[data-cv-print-ready='true']", { timeout: 15_000 });
    await page.emulateMediaType("print");

    await page.pdf({
      path: OUTPUT_PATH,
      format: "A4",
      printBackground: true,
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
    });

    console.log(`CV exported to ${OUTPUT_PATH}`);
  } finally {
    await browser.close();
  }
}

exportCvPdf().catch((error) => {
  const message = String(error?.message ?? error);
  if (message.includes("ERR_CONNECTION_REFUSED") || message.includes("ERR_CONNECTION_CLOSED")) {
    console.error(`Could not reach ${CV_EXPORT_ORIGIN}. Start \`npm run dev\` first, or set CV_EXPORT_ORIGIN to the dev server URL.`);
  } else {
    console.error("Failed to export CV PDF:", error);
  }
  process.exit(1);
});
