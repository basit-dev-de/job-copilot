import { Job, JobSearchFilters } from "../types/job";
import { UserProfile } from "../types/user";
import { searchLinkedInJobs } from "./linkedinApi";
import { scrapeIndeedJobs } from "./indeedScraper";
import { scrapeGlassdoorJobs } from "./glassdoorScraper";
import { analyzeJobsMatch } from "./aiFilter";
import { storeJobData, getStoredJobData } from "./storageService";

// Main service to search for jobs across multiple platforms
export const searchJobs = async (
  userProfile: UserProfile,
  customFilters?: JobSearchFilters,
  page = 1,
  perPage = 20,
  proxyEnabled = true
): Promise<{ jobs: Job[]; totalResults: number }> => {
  // Prepare filters based on user preferences and custom filters
  const filters: JobSearchFilters = {
    title: customFilters?.title || userProfile.jobPreferences.titles[0],
    location:
      customFilters?.location || userProfile.jobPreferences.locations[0],
    remote: customFilters?.remote ?? userProfile.jobPreferences.remote,
    jobType: customFilters?.jobType || userProfile.jobPreferences.jobTypes,
    includeKeywords:
      customFilters?.includeKeywords ||
      userProfile.jobPreferences.includeKeywords,
    excludeKeywords:
      customFilters?.excludeKeywords ||
      userProfile.jobPreferences.excludeKeywords,
    ...customFilters,
  };

  // Track which platforms to search
  const platforms = userProfile.jobPreferences.platforms;
  const results: Job[] = [];
  let totalResults = 0;

  // Search LinkedIn if enabled
  if (platforms.linkedin) {
    try {
      const linkedinResults = await searchLinkedInJobs(
        filters,
        page,
        perPage,
        proxyEnabled
      );
      results.push(...linkedinResults.jobs);
      totalResults += linkedinResults.totalResults;
    } catch (error) {
      console.error("Error searching LinkedIn:", error);
    }
  }

  // Search Indeed if enabled
  if (platforms.indeed) {
    try {
      const indeedResults = await scrapeIndeedJobs(
        filters,
        page,
        perPage,
        proxyEnabled
      );
      results.push(...indeedResults.jobs);
      totalResults += indeedResults.totalResults;
    } catch (error) {
      console.error("Error searching Indeed:", error);
    }
  }

  // Search Glassdoor if enabled
  if (platforms.glassdoor) {
    try {
      const glassdoorResults = await scrapeGlassdoorJobs(
        filters,
        page,
        perPage,
        proxyEnabled
      );
      results.push(...glassdoorResults.jobs);
      totalResults += glassdoorResults.totalResults;
    } catch (error) {
      console.error("Error searching Glassdoor:", error);
    }
  }

  // TODO: Implement other platforms as needed

  // Filter out jobs with excluded keywords
  const filteredJobs = results.filter((job) => {
    const lowerDescription = job.description.toLowerCase();
    const lowerTitle = job.title.toLowerCase();

    // Check excluded keywords
    if (filters.excludeKeywords && filters.excludeKeywords.length > 0) {
      for (const keyword of filters.excludeKeywords) {
        if (
          lowerDescription.includes(keyword.toLowerCase()) ||
          lowerTitle.includes(keyword.toLowerCase())
        ) {
          return false;
        }
      }
    }

    // Check included keywords (if specified)
    if (filters.includeKeywords && filters.includeKeywords.length > 0) {
      let hasIncluded = false;
      for (const keyword of filters.includeKeywords) {
        if (
          lowerDescription.includes(keyword.toLowerCase()) ||
          lowerTitle.includes(keyword.toLowerCase())
        ) {
          hasIncluded = true;
          break;
        }
      }
      if (!hasIncluded) return false;
    }

    return true;
  });

  // Run AI analysis on filtered jobs
  const analyzedJobs = await analyzeJobsMatch(filteredJobs, userProfile);

  // Sort jobs by AI score (highest first)
  analyzedJobs.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));

  // Save jobs to local storage
  await storeJobData("searchResults", {
    jobs: analyzedJobs,
    timestamp: Date.now(),
    filters,
  });

  return {
    jobs: analyzedJobs,
    totalResults,
  };
};

// Get saved jobs
export const getSavedJobs = async (): Promise<Job[]> => {
  const savedJobs = (await getStoredJobData<Job[]>("savedJobs")) || [];
  return savedJobs;
};

// Save a job
export const saveJob = async (job: Job): Promise<void> => {
  const savedJobs = await getSavedJobs();

  // Check if already saved
  if (!savedJobs.some((j) => j.id === job.id)) {
    savedJobs.push({
      ...job,
      saved: true,
      status: "saved",
    });

    await storeJobData("savedJobs", savedJobs);
  }
};

// Remove a saved job
export const unsaveJob = async (jobId: string): Promise<void> => {
  const savedJobs = await getSavedJobs();
  const updatedJobs = savedJobs.filter((job) => job.id !== jobId);
  await storeJobData("savedJobs", updatedJobs);
};
