"use client";

import resume from "@/data/resume.json";

function formatDateRange(startDate?: string, endDate?: string) {
  if (!startDate && !endDate) return null;
  if (!startDate) return endDate;
  if (!endDate) return `${startDate} - Present`;
  return `${startDate} - ${endDate}`;
}

export default function ResumeRenderer() {
  const { basics, work, education, skills, projects } = resume;

  return (
    <article className="mx-auto w-full max-w-4xl rounded-lg border border-glass-edge bg-window p-5 text-label-primary shadow-[0_18px_60px_rgba(0,0,0,0.38)] sm:p-8">
      <header id="summary" className="scroll-mt-4 border-b border-glass-edge pb-5">
        <h1 className="text-[22px] font-semibold">{basics.name}</h1>
        <p className="mt-1 text-[13px] text-label-secondary">{basics.label}</p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-label-secondary">
          {basics.email ? <span>{basics.email}</span> : null}
          {basics.phone ? <span>{basics.phone}</span> : null}
          {basics.location ? (
            <span>
              {basics.location.city}, {basics.location.region},{" "}
              {basics.location.countryCode}
            </span>
          ) : null}
        </div>
        {basics.summary ? (
          <p className="mt-4 text-[15px] leading-6 text-label-primary">
            {basics.summary}
          </p>
        ) : null}
      </header>

      <section id="experience" className="scroll-mt-4 mt-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-label-secondary">
          Experience
        </h2>
        <div className="mt-3 space-y-4">
          {work.map((job) => (
            <div key={`${job.name}-${job.position}-${job.startDate}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-[15px] font-medium">
                  {job.position} · {job.name}
                </h3>
                <p className="text-[13px] text-label-secondary">
                  {formatDateRange(job.startDate, job.endDate)}
                </p>
              </div>
              {job.location ? (
                <p className="mt-1 text-[13px] text-label-secondary">
                  {job.location}
                </p>
              ) : null}
              {job.summary ? (
                <p className="mt-2 text-[14px] text-label-primary">
                  {job.summary}
                </p>
              ) : null}
              {job.highlights?.length ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-label-primary">
                  {job.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section id="education" className="scroll-mt-4 mt-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-label-secondary">
          Education
        </h2>
        <div className="mt-3 space-y-4">
          {education.map((school) => (
            <div key={`${school.institution}-${school.area}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-[15px] font-medium">
                  {school.studyType} · {school.area}
                </h3>
                <p className="text-[13px] text-label-secondary">
                  {school.endDate}
                </p>
              </div>
              <p className="mt-1 text-[14px] text-label-secondary">
                {school.institution}
                {school.location ? ` · ${school.location}` : ""}
              </p>
              {school.score ? (
                <p className="mt-1 text-[14px] text-label-primary">
                  {school.score}
                </p>
              ) : null}
              {school.courses?.length ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-label-primary">
                  {school.courses.map((course) => (
                    <li key={course}>{course}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section id="skills" className="scroll-mt-4 mt-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-label-secondary">
          Skills
        </h2>
        <div className="mt-3 space-y-3">
          {skills.map((skillGroup) => (
            <div key={skillGroup.name}>
              <h3 className="text-[14px] font-medium">{skillGroup.name}</h3>
              <p className="mt-1 text-[14px] text-label-primary">
                {skillGroup.keywords.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="projects" className="scroll-mt-4 mt-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-label-secondary">
          Projects
        </h2>
        <div className="mt-3 space-y-4">
          {projects.map((project) => (
            <div key={project.name}>
              <h3 className="text-[15px] font-medium">{project.name}</h3>
              {project.description ? (
                <p className="mt-1 text-[14px] text-label-primary">
                  {project.description}
                </p>
              ) : null}
              {project.highlights?.length ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-label-primary">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
              {project.keywords?.length ? (
                <p className="mt-2 text-[13px] text-label-secondary">
                  {project.keywords.join(" · ")}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
