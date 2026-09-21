import { NextResponse } from "next/server";
import resume, { type ResumeProfile } from "@/data/resume";
import { displayUrl, formatDateRange } from "@/app/components/CV/resumeFormat";

export const dynamic = "force-static";

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSection(title: string, body: string) {
  if (!body.trim()) return "";

  return `
    <section>
      <h2>${escapeHtml(title)}</h2>
      ${body}
    </section>
  `;
}

function renderList(items: string[]) {
  if (!items.length) return "";

  return `
    <ul>
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderSkillsList(
  skills: Array<{ name: string; keywords: string[] }>,
) {
  if (!skills.length) return "";

  return `
    <ul class="skills">
      ${skills
        .map(
          (skillGroup) =>
            `<li><strong>${escapeHtml(skillGroup.name)}:</strong> ${escapeHtml(skillGroup.keywords.join(", "))}</li>`,
        )
        .join("")}
    </ul>
  `;
}

function renderEntryHead(title: string, meta: string) {
  return `
    <div class="entry-head">
      <p>${title}</p>
      ${meta ? `<p class="meta">${escapeHtml(meta)}</p>` : ""}
    </div>
  `;
}

function renderContactLinks(profiles: ResumeProfile[] | undefined) {
  return (profiles ?? [])
    .map((profile) => profile.url)
    .filter((url): url is string => Boolean(url))
    .map((url) => displayUrl(url));
}

function renderResumeHtml() {
  const { basics, skills, education, work, projects } = resume;
  const location = basics.location
    ? [basics.location.city, basics.location.region].filter(Boolean).join(", ")
    : "";

  const contactItems = [
    location,
    basics.phone,
    basics.email,
    ...renderContactLinks(basics.profiles),
  ].filter((item): item is string => Boolean(item));
  const contact = escapeHtml(contactItems.join(" | "));
  const summary = "summary" in basics ? String(basics.summary ?? "") : "";

  const skillsHtml = renderSkillsList(skills);

  const educationHtml = education
    .map((school) => {
      const dateRange = formatDateRange(school.startDate, school.endDate);
      const courses = school.courses?.length
        ? `<p><strong>Relevant Skills:</strong></p>${renderList(school.courses)}`
        : "";

      return `
        <div class="entry">
          ${renderEntryHead(
            `<strong>${escapeHtml(school.studyType)}, ${escapeHtml(school.area)}</strong> - ${escapeHtml(school.institution)}${school.location ? `, ${escapeHtml(school.location)}` : ""}`,
            dateRange,
          )}
          ${courses}
        </div>
      `;
    })
    .join("");

  const workHtml = work
    .map((job) => {
      const bullets = job.highlights?.length
        ? renderList(job.highlights)
        : job.summary
          ? renderList([job.summary])
          : "";

      return `
        <div class="entry">
          ${renderEntryHead(
            `<strong>${escapeHtml(job.position)}</strong> - ${escapeHtml(job.name)}${job.location ? `, ${escapeHtml(job.location)}` : ""}`,
            formatDateRange(job.startDate, job.endDate),
          )}
          ${bullets}
        </div>
      `;
    })
    .join("");

  const projectsHtml = projects
    .map((project) => {
      const projectUrl = "url" in project ? project.url : undefined;
      const bullets = [
        project.description,
        ...(project.highlights ?? []),
      ].filter(Boolean) as string[];

      return `
        <div class="entry">
          ${renderEntryHead(
            `<strong>${escapeHtml(project.name)}</strong>`,
            projectUrl ? displayUrl(projectUrl) : "",
          )}
          ${renderList(bullets)}
        </div>
      `;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(basics.name)} Resume</title>
    <style>
      @page {
        size: A4;
        margin: 8mm 13mm;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        background: #fff;
        color: #171717;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10.2pt;
        line-height: 1.35;
      }

      main {
        width: 100%;
      }

      header {
        text-align: center;
      }

      h1 {
        margin: 0;
        font-size: 18pt;
        line-height: 1.1;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .contact {
        margin-top: 7px;
        font-size: 9.5pt;
      }

      h2 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 21px 0 10px;
        break-after: avoid;
        font-size: 10.5pt;
        letter-spacing: 0.06em;
        line-height: 1;
        text-transform: uppercase;
      }

      h2::before,
      h2::after {
        content: "";
        flex: 1;
        height: 0.8px;
        background: #171717;
      }

      p {
        margin: 0;
      }

      ul {
        margin: 3px 0 0;
        padding-left: 16px;
      }

      li {
        margin: 0 0 3.5px;
      }

      .entry {
        break-inside: avoid;
        margin-bottom: 12px;
      }

      .entry:last-child {
        margin-bottom: 0;
      }

      .entry-head {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      .meta {
        flex-shrink: 0;
        font-style: italic;
      }

      .skills li {
        margin-bottom: 3px;
      }
    </style>
  </head>
  <body>
    <main data-cv-print-ready="true">
      <header>
        <h1>${escapeHtml(basics.name)}</h1>
        <div class="contact">${contact}</div>
      </header>

      ${renderSection("Professional Summary", summary ? `<p>${escapeHtml(summary)}</p>` : "")}
      ${renderSection("Professional Experience", workHtml)}
      ${renderSection("Education", educationHtml)}
      ${renderSection("Projects", projectsHtml)}
      ${renderSection("Technical Skills", skillsHtml)}
    </main>
  </body>
</html>`;
}

export function GET() {
  return new NextResponse(renderResumeHtml(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
