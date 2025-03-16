export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  url: string;
  datePosted: string;
  platform: string;
  requirements?: string[];
  tags?: string[];
  applied: boolean;
  saved: boolean;
  aiScore?: number;
  aiMatches?: {
    skill: string;
    confidence: number;
  }[];
  aiMismatches?: {
    requirement: string;
    reason: string;
  }[];
  status: "new" | "saved" | "applied" | "interviewing" | "offered" | "rejected";
}

export interface JobSearchFilters {
  title?: string;
  location?: string;
  remote?: boolean;
  salary?: number;
  datePosted?: "today" | "past3Days" | "pastWeek" | "pastMonth" | "anytime";
  jobType?: ("full-time" | "part-time" | "contract" | "internship")[];
  experience?: ("entry" | "mid" | "senior" | "director")[];
  includeKeywords?: string[];
  excludeKeywords?: string[];
  platforms?: string[];
}

export interface ApplicationDetails {
  jobId: string;
  appliedDate: string;
  coverLetter?: string;
  resumeUsed?: string;
  applicationUrl?: string;
  notes?: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  followUps?: {
    date: string;
    method: "email" | "phone" | "other";
    notes: string;
  }[];
}
