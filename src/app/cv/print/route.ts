import { NextResponse } from "next/server";
import resume from "@/data/resume.json";
import { displayUrl, formatDateRange } from "@/app/components/CV/resumeFormat";

export const dynamic = "force-static";

type ResumeLink = {
  network: string;
  url: string;
};

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
    <ul>
      ${skills
        .map(
          (skillGroup) =>
            `<li><strong>${escapeHtml(skillGroup.name)}:</strong> ${escapeHtml(skillGroup.keywords.join(", "))}</li>`,
        )
        .join("")}
    </ul>
  `;
}

function renderContactLinks(profiles: ResumeLink[] | undefined) {
  return (profiles ?? [])
    .filter((profile) => profile.url)
    .map((profile) => displayUrl(profile.url));
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
          <p><strong>${escapeHtml(school.studyType)}: ${escapeHtml(school.area)}</strong></p>
          <p>${escapeHtml(school.institution)}${school.location ? ` - ${escapeHtml(school.location)}` : ""}</p>
          ${dateRange ? `<p class="meta">${escapeHtml(dateRange)}</p>` : ""}
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
          <p><strong>${escapeHtml(job.position)}</strong> - ${escapeHtml(job.name)}${job.location ? `, ${escapeHtml(job.location)}` : ""}</p>
          <p class="meta">${escapeHtml(formatDateRange(job.startDate, job.endDate))}</p>
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
          <p><strong>${escapeHtml(project.name)}</strong>${projectUrl ? ` - ${escapeHtml(displayUrl(projectUrl))}` : ""}</p>
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
        margin: 8mm;
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
        font-size: 9.6pt;
        line-height: 1.13;
      }

      main {
        width: 100%;
      }

      header {
        text-align: center;
      }

      h1 {
        margin: 0;
        font-size: 16pt;
        line-height: 1.06;
        text-transform: uppercase;
      }

      .contact {
        margin-top: 3px;
        font-size: 9.2pt;
        line-height: 1.12;
      }

      h2 {
        margin: 7px 0 3px;
        border-bottom: 0.7px solid #333;
        break-after: avoid;
        font-size: 10.4pt;
        letter-spacing: 0.02em;
        line-height: 1.12;
        text-transform: uppercase;
      }

      p {
        margin: 0;
      }

      ul {
        margin: 1.5px 0 0;
        padding-left: 15px;
      }

      li {
        margin: 0 0 0.5px;
      }

      .entry {
        break-inside: avoid;
        margin-bottom: 4px;
      }

      section {
        break-inside: auto;
      }

      .meta {
        font-style: italic;
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
      ${renderSection("Technical Skills", skillsHtml)}
      ${renderSection("Professional Experience", workHtml)}
      ${renderSection("Education", educationHtml)}
      ${renderSection("Projects", projectsHtml)}
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
