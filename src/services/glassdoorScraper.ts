import { Job, JobSearchFilters } from "../types/job";
import { delayExecution, getRandomProxy } from "../utils/networkUtils";
import { v4 as uuidv4 } from "uuid";

// This is a simulation of Glassdoor scraping
export const scrapeGlassdoorJobs = async (
  filters: JobSearchFilters,
  page = 1,
  perPage = 20,
  proxyEnabled = true
): Promise<{ jobs: Job[]; totalResults: number }> => {
  console.log("Scraping Glassdoor jobs...", page, perPage, filters);
  // Simulate network delay
  await delayExecution(2000, 5000);

  // Use proxy if enabled
  const proxy = proxyEnabled ? getRandomProxy() : null;
  console.log(`Using proxy: ${proxy || "none"}`);

  // Simulate scraping - in a real app, this would be actual web scraping
  const mockJobs: Job[] = Array.from({ length: 10 }, (_, i) => ({
    id: uuidv4(),
    title: `${filters.title || "Frontend Developer"} ${i + 1}`,
    company: `Glassdoor Company ${i + 1}`,
    location: filters.remote ? "Remote" : filters.location || "Seattle, WA",
    description: `This is a job description for job ${
      i + 1
    } from Glassdoor. It includes company benefits and work environment details.`,
    salary:
      i % 2 === 0 ? `${90000 + i * 7000} - ${100000 + i * 7000}` : undefined,
    url: `https://glassdoor.com/jobs/${i + 1}`,
    datePosted: new Date(Date.now() - i * 60000000).toISOString(),
    platform: "Glassdoor",
    requirements: [
      "Experience with React",
      `${2 + Math.floor(i / 2)} years of experience`,
      "CSS/SCSS proficiency",
      "Ability to work in an agile environment",
    ],
    tags: ["frontend", "react", "css", "ui"],
    applied: false,
    saved: false,
    status: "new",
  }));

  // Return mock data
  return {
    jobs: mockJobs,
    totalResults: 100, // Mock total results
  };
};
