"use client";

import type { ReactNode } from "react";
import resume, { type ResumeProfile } from "@/data/resume";
import { displayUrl, formatDateRange } from "./resumeFormat";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex items-center gap-2 text-center text-[10.5px] font-bold uppercase leading-none text-black print:mt-3 print:text-[12px]">
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
  const profileLinks =
    basics.profiles?.filter(
      (profile): profile is ResumeProfile & { url: string } =>
        Boolean(profile.url),
    ) ?? [];
  const summary = "summary" in basics ? String(basics.summary ?? "") : "";

  return (
    <article className="mx-auto w-full max-w-[820px] bg-white px-9 py-8 text-[10px] leading-[1.28] text-black shadow-[0_18px_60px_rgba(0,0,0,0.34)] print:max-w-none print:px-0 print:py-0 print:text-[11px] print:leading-[1.24] print:shadow-none">
      <header id="contact" className="scroll-mt-4 text-center">
        <h1 className="text-[15.5px] font-bold uppercase leading-none tracking-normal text-black print:text-[17.5px]">
          {basics.name}
        </h1>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-[10px] leading-tight text-black print:text-[10.5px]">
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
          {profileLinks.map((profile) => (
            <span key={profile.url} className="contents">
              <span aria-hidden="true">·</span>
              <a className="underline" href={profile.url}>
                {displayUrl(profile.url)}
              </a>
            </span>
          ))}
        </div>
      </header>

      {summary ? (
        <section id="summary-content" className="scroll-mt-4">
          <SectionTitle>Professional Summary</SectionTitle>
          <p className="mt-2 print:mt-1.5">{summary}</p>
        </section>
      ) : null}

      <section id="experience" className="scroll-mt-4">
        <SectionTitle>Professional Experience</SectionTitle>
        <div className="mt-2 space-y-3 print:mt-1.5 print:space-y-2">
          {work.map((job) => (
            <div key={`${job.name}-${job.position}-${job.startDate}`}>
              <div className="flex justify-between gap-3">
                <p>
                  <span className="font-bold">{job.position}</span>
                  {" - "}
                  {job.name}
                  {job.location ? `, ${job.location}` : ""}
                </p>
                <p className="shrink-0 italic">
                  {formatDateRange(job.startDate, job.endDate)}
                </p>
              </div>
              {job.highlights?.length ? (
                <ul className="mt-1 list-disc space-y-1 pl-5 print:mt-1 print:space-y-0.5">
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

      <section id="education" className="scroll-mt-4">
        <SectionTitle>Education</SectionTitle>
        <div className="mt-2 space-y-2 print:mt-1.5 print:space-y-1.5">
          {education.map((school) => (
            <div key={`${school.institution}-${school.area}`}>
              <div className="flex justify-between gap-3">
                <p>
                  <span className="font-bold">
                    {school.studyType}, {school.area}
                  </span>
                  {" - "}
                  {school.institution}
                  {school.location ? `, ${school.location}` : ""}
                </p>
                {school.startDate || school.endDate ? (
                  <p className="shrink-0 italic">
                    {formatDateRange(school.startDate, school.endDate)}
                  </p>
                ) : null}
              </div>
              {school.courses?.length ? (
                <>
                  <p className="mt-1">Relevant Skills:</p>
                  <ul className="mt-0.5 list-disc space-y-0.5 pl-5 print:space-y-0.5">
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

      <section id="projects" className="scroll-mt-4">
        <SectionTitle>Projects</SectionTitle>
        <div className="mt-2 space-y-3 print:mt-1.5 print:space-y-2">
          {projects.map((project) => {
            const projectUrl = "url" in project ? project.url : undefined;
            return (
            <div key={project.name}>
              <div className="flex justify-between gap-3">
                <h3 className="font-bold">{project.name}</h3>
                {projectUrl ? (
                  <a className="shrink-0 italic underline" href={projectUrl}>
                    {displayUrl(projectUrl)}
                  </a>
                ) : null}
              </div>
              {project.description || project.highlights?.length ? (
                <ul className="mt-1 list-disc space-y-1 pl-5 print:mt-1 print:space-y-0.5">
                  {project.description ? <li>{project.description}</li> : null}
                  {project.highlights?.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
            </div>
            );
          })}
        </div>
      </section>
      <section id="skills" className="scroll-mt-4">
        <SectionTitle>Technical Skills</SectionTitle>
        <ul className="mt-2 list-disc space-y-1 pl-5 print:mt-1.5 print:space-y-0.5">
          {skills.map((skillGroup) => (
            <li key={skillGroup.name}>
              <span className="font-bold">{skillGroup.name}:</span>{" "}
              {skillGroup.keywords.join(", ")}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
