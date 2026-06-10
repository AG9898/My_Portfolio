/**
 * Push the canonical resume to Waunder (the personal job-application assistant).
 *
 * Waunder treats this portfolio's JSON Resume (src/data/resume.json) as the
 * single source of truth for the resume. Rather than have Waunder parse a PDF,
 * this script pushes the three export artifacts and Waunder maps them
 * deterministically into its Profile + primary ResumeDocument:
 *
 *   src/data/resume.json -> structured Profile fields + parsed_structure
 *   public/CV_AG.md      -> raw_text (LLM grounding)        [optional]
 *   public/cv.pdf        -> the file a worker uploads to an ATS form [optional]
 *
 * Run order (push-on-export): regenerate the PDF first, then sync:
 *   npm run export:cv && npm run sync:resume
 *
 * Auth: Waunder is single-user. We open a session with its shared secret
 * (the same value as Waunder's APP_SHARED_SECRET) and reuse the session cookie
 * for the multipart upload. The secret is read from the environment and never
 * logged.
 *
 * Env:
 *   WAUNDER_BASE_URL    public origin of the Waunder web service
 *                       (e.g. https://waunder.up.railway.app)
 *   WAUNDER_APP_SECRET  Waunder APP_SHARED_SECRET, used to open a session
 *
 * Usage:
 *   WAUNDER_BASE_URL=... WAUNDER_APP_SECRET=... npm run sync:resume
 */

const fs = require("node:fs/promises");
const path = require("node:path");

const BASE_URL = process.env.WAUNDER_BASE_URL;
const APP_SECRET = process.env.WAUNDER_APP_SECRET;

const RESUME_JSON_PATH = path.resolve(process.cwd(), "src/data/resume.json");
const RESUME_PDF_PATH = path.resolve(process.cwd(), "public/cv.pdf");
const RESUME_MD_PATH = path.resolve(process.cwd(), "public/CV_AG.md");

async function syncResume() {
  if (!BASE_URL || !APP_SECRET) {
    throw new Error(
      "Set WAUNDER_BASE_URL and WAUNDER_APP_SECRET before syncing the resume.",
    );
  }

  const resumeJson = await fs.readFile(RESUME_JSON_PATH, "utf8");
  JSON.parse(resumeJson); // fail fast on malformed source JSON

  // 1) Open a Waunder session with the shared secret.
  const loginResponse = await fetch(new URL("/api/session", BASE_URL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passphrase: APP_SECRET }),
  });
  if (!loginResponse.ok) {
    throw new Error(
      `Waunder login failed (${loginResponse.status}). Check WAUNDER_APP_SECRET.`,
    );
  }
  const cookieHeader = loginResponse.headers
    .getSetCookie()
    .map((cookie) => cookie.split(";")[0])
    .join("; ");

  // 2) Build the multipart payload from the export artifacts.
  const form = new FormData();
  form.set("resume", resumeJson);

  const markdown = await readOptionalText(RESUME_MD_PATH);
  if (markdown !== null) {
    form.set("resume_markdown", markdown);
  }

  const pdf = await readOptionalBytes(RESUME_PDF_PATH);
  if (pdf !== null) {
    form.set("resume_pdf", new Blob([pdf], { type: "application/pdf" }), "cv.pdf");
  }

  // 3) Push to the ingest endpoint with the session cookie.
  const ingestResponse = await fetch(new URL("/api/profile/resume", BASE_URL), {
    method: "POST",
    headers: { Cookie: cookieHeader },
    body: form,
  });
  if (!ingestResponse.ok) {
    const detail = await ingestResponse.text();
    throw new Error(`Resume sync failed (${ingestResponse.status}): ${detail}`);
  }

  const body = await ingestResponse.json();
  console.log(
    `Resume synced to Waunder — parse_status: ${body?.resume?.parse_status}, ` +
      `file_attached: ${body?.resume?.file_attached}`,
  );
}

async function readOptionalText(filePath) {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function readOptionalBytes(filePath) {
  try {
    return await fs.readFile(filePath);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

syncResume().catch((error) => {
  console.error(String(error?.message ?? error));
  process.exit(1);
});
