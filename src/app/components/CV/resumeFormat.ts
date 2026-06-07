/**
 * Shared formatting helpers for the CV subsystem.
 *
 * Imported by both the on-site renderer (`ResumeRenderer.tsx`) and the
 * parser-safe export surface (`src/app/cv/print/route.ts`) so date and URL
 * formatting stay identical across the on-screen CV and the exported PDF.
 *
 * Plain TypeScript, no React — safe to import from a route handler.
 */

export function formatDate(date?: string) {
  if (!date) return "";

  const [year, month] = date.split("-");
  if (!month) return year;

  const parsed = new Date(Date.UTC(Number(year), Number(month) - 1));
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function formatDateRange(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) return "";
  if (!startDate) return formatDate(endDate);
  if (!endDate) return `${formatDate(startDate)} - Present`;
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
