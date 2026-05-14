"use client";

import type { ReactNode } from "react";
import resume from "@/data/resume.json";

function formatDateRange(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) return null;
  if (!startDate) return formatDate(endDate);
  if (!endDate) return `${formatDate(startDate)} - Present`;
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function formatDate(date?: string) {
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

function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 flex items-center gap-2 text-center text-[11px] font-bold uppercase leading-none text-black print:mt-2">
      <div className="h-px flex-1 bg-black" aria-hidden="true" />
      <h2 className="shrink-0">{children}</h2>
      <div className="h-px flex-1 bg-black" aria-hidden="true" />
    </div>
  );
}

export default function ResumeRenderer() {
  const { basics, work, education, skills, projects } = resume;
  const location = basics.location
    ? [basics.location.city, basics.location.region].filter(Boolean).join(", ")
    : null;
  const linkedIn = basics.profiles?.find(
    (profile) => profile.network.toLowerCase() === "linkedin",
  );

  return (
    <article className="mx-auto w-full max-w-[820px] bg-white px-9 py-8 text-[10.5px] leading-[1.28] text-black shadow-[0_18px_60px_rgba(0,0,0,0.34)] print:max-w-none print:px-0 print:py-0 print:text-[9.4px] print:leading-[1.22] print:shadow-none">
      <header id="summary" className="scroll-mt-4 text-center">
        <h1 className="text-[16px] font-bold uppercase leading-none tracking-normal text-black print:text-[15px]">
          {basics.name}
        </h1>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-[10.5px] leading-tight text-black print:text-[9.4px]">
          {location ? <span>{location}</span> : null}
          {basics.phone ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{basics.phone}</span>
            </>
          ) : null}
          {basics.email ? (
            <>
              <span aria-hidden="true">·</span>
              <a className="underline" href={`mailto:${basics.email}`}>
                {basics.email}
              </a>
            </>
          ) : null}
          {linkedIn?.url ? (
            <>
              <span aria-hidden="true">·</span>
              <a className="underline" href={linkedIn.url}>
                {displayUrl(linkedIn.url)}
              </a>
            </>
          ) : null}
        </div>
      </header>

      <section id="skills" className="scroll-mt-4">
        <SectionTitle>Tech Stack</SectionTitle>
        <ul className="mt-2 list-disc space-y-0.5 pl-5">
          {skills.map((skillGroup) => (
            <li key={skillGroup.name}>
              <span className="font-bold">{skillGroup.name}:</span>{" "}
              {skillGroup.keywords.join(", ")}
            </li>
          ))}
        </ul>
      </section>

      <section id="education" className="scroll-mt-4">
        <SectionTitle>Education</SectionTitle>
        <div className="mt-2 space-y-2">
          {education.map((school) => (
            <div key={`${school.institution}-${school.area}`}>
              <p>
                <span className="font-bold">{school.studyType}:</span>{" "}
                {school.area}
                {school.score ? ` [${school.score}]` : ""}
              </p>
              <p className="mt-0.5">
                <span className="font-bold">{school.institution}</span>
                {school.location ? ` - ${school.location}` : ""}
              </p>
              <p className="sr-only">
                {school.institution}
                {school.location ? ` · ${school.location}` : ""}
              </p>
              {school.courses?.length ? (
                <>
                  <p className="mt-1">Relevant Skills:</p>
                  <ul className="mt-0.5 list-disc space-y-0.5 pl-5">
                    {school.courses.map((course) => (
                      <li key={course}>{course}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section id="experience" className="scroll-mt-4">
        <SectionTitle>Professional Experience</SectionTitle>
        <div className="mt-2 space-y-2.5">
          {work.map((job) => (
            <div key={`${job.name}-${job.position}-${job.startDate}`}>
              <p>
                <span className="font-bold">{job.position}</span>
                {" - "}
                <span className="italic">{job.name}</span>
              </p>
              <p className="mt-0.5 italic">
                {formatDateRange(job.startDate, job.endDate)}
              </p>
              {job.highlights?.length ? (
                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                  {job.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : job.summary ? (
                <ul className="mt-1 list-disc pl-5">
                  <li>{job.summary}</li>
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="scroll-mt-4">
        <SectionTitle>Projects</SectionTitle>
        <div className="mt-2 space-y-2.5">
          {projects.map((project) => (
            <div key={project.name}>
              <h3 className="font-bold">{project.name}</h3>
              {project.description || project.highlights?.length ? (
                <ul className="mt-1 list-disc space-y-0.5 pl-5">
                  {project.description ? <li>{project.description}</li> : null}
                  {project.highlights?.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
