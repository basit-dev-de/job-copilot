import { Job } from "../types/job";
import { UserProfile } from "../types/user";

// In a real app, this would use OpenAI or another AI service
// This is a simulation for demonstration purposes
export const analyzeJobMatch = async (
  job: Job,
  userProfile: UserProfile
): Promise<Job> => {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Calculate a match score based on skills
  const userSkills = userProfile.skills || [];
  const jobRequirements = job.requirements || [];

  // Convert job description and requirements to lowercase for case-insensitive matching
  const lowerJobDescription = job.description.toLowerCase();
  const lowerJobRequirements = jobRequirements.map((req) => req.toLowerCase());

  // Calculate matches
  const matches = userSkills
    .filter((skill) => {
      const lowerSkill = skill.toLowerCase();
      return (
        lowerJobDescription.includes(lowerSkill) ||
        lowerJobRequirements.some((req) => req.includes(lowerSkill))
      );
    })
    .map((skill) => ({
      skill,
      confidence: Math.random() * 0.4 + 0.6, // Random confidence between 60-100%
    }));

  // Calculate mismatches (requirements not matched by user skills)
  const mismatches = jobRequirements
    .filter((req) => {
      const lowerReq = req.toLowerCase();
      return !userSkills.some((skill) =>
        lowerReq.includes(skill.toLowerCase())
      );
    })
    .slice(0, 3) // Limit to top 3 mismatches
    .map((requirement) => ({
      requirement,
      reason: `No matching skill found in your profile.`,
    }));

  // Calculate overall match score (0-100)
  const matchPercentage =
    userSkills.length > 0
      ? (matches.length / userSkills.length) * 70 +
        (1 - mismatches.length / jobRequirements.length) * 30
      : 50; // Default score if no skills defined

  const aiScore = Math.min(Math.max(Math.round(matchPercentage), 1), 100);

  // Return job with AI analysis
  return {
    ...job,
    aiScore,
    aiMatches: matches,
    aiMismatches: mismatches,
  };
};

// Analyze multiple jobs
export const analyzeJobsMatch = async (
  jobs: Job[],
  userProfile: UserProfile
): Promise<Job[]> => {
  const analyzedJobs = [];

  for (const job of jobs) {
    analyzedJobs.push(await analyzeJobMatch(job, userProfile));
  }

  return analyzedJobs;
};
