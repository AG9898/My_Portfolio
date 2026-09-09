import resumeJson from "./resume.json";

/**
 * Explicit domain types for the JSON Resume v1 document in `resume.json`.
 *
 * `resume.json` is the agent-editable source of truth for CV content, so its
 * shape changes whenever content is edited. Importing the JSON directly makes
 * TypeScript infer the type from whatever literals happen to be present, which
 * means trimming an optional field (a project URL, an education `courses` list)
 * turns every reader of that field into a compile error. Declaring the schema
 * here decouples the renderers from the current contents: optional fields stay
 * optional whether or not any entry fills them in.
 */
export type ResumeProfile = {
  network: string;
  username?: string;
  url?: string;
};

export type ResumeLocation = {
  address?: string;
  postalCode?: string;
  city?: string;
  region?: string;
  countryCode?: string;
};

export type ResumeBasics = {
  name: string;
  label?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: ResumeLocation;
  profiles?: ResumeProfile[];
};

export type ResumeWork = {
  name: string;
  position: string;
  location?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
};

export type ResumeEducation = {
  institution: string;
  area: string;
  studyType: string;
  location?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
  courses?: string[];
};

export type ResumeSkill = {
  name: string;
  level?: string;
  keywords: string[];
};

export type ResumeProject = {
  name: string;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  highlights?: string[];
  keywords?: string[];
};

export type Resume = {
  basics: ResumeBasics;
  work: ResumeWork[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
};

export const resume: Resume = resumeJson;

export default resume;
