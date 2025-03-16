// src/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { getSavedJobs } from "../services/jobAggregatorService";
import { Job } from "../types/job";
import JobCard from "../components/common/JobCard";
import { getStoredJobData } from "../services/storageService";

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [recentSearchResults, setRecentSearchResults] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSaved: 0,
    totalApplied: 0,
    totalInterviews: 0,
    avgMatchScore: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Get saved jobs
        const saved = await getSavedJobs();
        setSavedJobs(saved);

        // Get recent search results
        const searchResultsData = await getStoredJobData<{
          jobs: Job[];
          timestamp: number;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filters: any;
        }>("searchResults");

        if (searchResultsData && searchResultsData.jobs) {
          // Get the top 3 results
          setRecentSearchResults(searchResultsData.jobs.slice(0, 3));
        }

        // Get applied jobs (in a real app, you'd have a dedicated endpoint for this)
        const applied = saved.filter(
          (job) => job.applied || job.status !== "new"
        );
        setAppliedJobs(applied);

        // Calculate stats
        setStats({
          totalSaved: saved.length,
          totalApplied: applied.length,
          totalInterviews: applied.filter(
            (job) => job.status === "interviewing"
          ).length,
          avgMatchScore:
            saved.length > 0
              ? Math.round(
                  saved.reduce((sum, job) => sum + (job.aiScore || 0), 0) /
                    saved.length
                )
              : 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApply = (job: Job) => {
    navigate(`/applications?jobId=${job.id}`);
  };

  // Function to refresh the saved jobs list when a job is unsaved
  const handleUnsave = async () => {
    const updated = await getSavedJobs();
    setSavedJobs(updated);

    // Update stats
    setStats((prev) => ({
      ...prev,
      totalSaved: updated.length,
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user?.name || "User"}! Here's your job search overview.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card flex flex-col">
              <span className="text-gray-500 text-sm">Saved Jobs</span>
              <span className="text-3xl font-bold text-gray-900">
                {stats.totalSaved}
              </span>
              <Link
                to="/search"
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Find more jobs
              </Link>
            </div>

            <div className="card flex flex-col">
              <span className="text-gray-500 text-sm">Applied</span>
              <span className="text-3xl font-bold text-gray-900">
                {stats.totalApplied}
              </span>
              <Link
                to="/applications"
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                View applications
              </Link>
            </div>

            <div className="card flex flex-col">
              <span className="text-gray-500 text-sm">Interviews</span>
              <span className="text-3xl font-bold text-gray-900">
                {stats.totalInterviews}
              </span>
              <Link
                to="/applications?filter=interviewing"
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                View interviews
              </Link>
            </div>

            <div className="card flex flex-col">
              <span className="text-gray-500 text-sm">Avg. Match Score</span>
              <span className="text-3xl font-bold text-gray-900">
                {stats.avgMatchScore}%
              </span>
              <span className="mt-2 text-sm text-gray-500">
                Based on your saved jobs
              </span>
            </div>
          </div>

          {/* Recent Job Activity */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Saved Jobs</h2>
              {savedJobs.length > 0 && (
                <Link
                  to="/applications"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View all ({savedJobs.length})
                </Link>
              )}
            </div>

            {savedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedJobs.slice(0, 4).map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onUnsave={handleUnsave}
                    onApply={handleApply}
                  />
                ))}
              </div>
            ) : (
              <div className="card flex flex-col items-center justify-center py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">
                  No saved jobs yet
                </h3>
                <p className="text-gray-500 text-center mt-2 max-w-md">
                  Start searching for jobs that match your skills and save them
                  to track your progress.
                </p>
                <Link to="/search" className="mt-4 btn-primary">
                  Find Jobs
                </Link>
              </div>
            )}
          </div>

          {/* Recent Search Results */}
          {recentSearchResults.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Search Results
                </h2>
                <Link
                  to="/search"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentSearchResults.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApply={handleApply}
                    onSave={() => {
                      // Update the saved jobs count when a new job is saved
                      setStats((prev) => ({
                        ...prev,
                        totalSaved: prev.totalSaved + 1,
                      }));
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Application Progress */}
          {appliedJobs.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Application Progress
                </h2>
                <Link
                  to="/applications"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              </div>

              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Job
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Company
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Applied Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appliedJobs.slice(0, 5).map((job) => (
                        <tr key={job.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {job.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {job.company}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(job.datePosted).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                job.status === "interviewing"
                                  ? "bg-green-100 text-green-800"
                                  : job.status === "applied"
                                  ? "bg-blue-100 text-blue-800"
                                  : job.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : job.status === "offered"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {job.status.charAt(0).toUpperCase() +
                                job.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/applications?jobId=${job.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Call to action if no activity */}
          {savedJobs.length === 0 && recentSearchResults.length === 0 && (
            <div className="card bg-blue-50 border border-blue-200 p-8 text-center">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">
                Start Your Job Search Journey
              </h2>
              <p className="text-blue-600 mb-6 max-w-xl mx-auto">
                Job Copilot will help you find, track, and apply to jobs that
                match your skills and preferences.
              </p>
              <Link
                to="/search"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Search for Jobs
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
