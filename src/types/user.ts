export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  location: string;
  resume?: File;
  resumeText?: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  onboardingCompleted: boolean;
  jobPreferences: JobPreferences;
}

export interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  skills: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface JobPreferences {
  titles: string[];
  locations: string[];
  remote: boolean;
  minSalary?: number;
  jobTypes: ("full-time" | "part-time" | "contract" | "internship")[];
  excludeKeywords: string[];
  includeKeywords: string[];
  platforms: {
    linkedin: boolean;
    indeed: boolean;
    glassdoor: boolean;
    other: string[];
  };
}
