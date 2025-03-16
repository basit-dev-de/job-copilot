// src/pages/JobSearch.tsx
import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { Job, JobSearchFilters } from "../types/job";
import { searchJobs, getSavedJobs } from "../services/jobAggregatorService";
import JobCard from "../components/common/JobCard";
import { useNavigate } from "react-router-dom";

const JobSearch: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<JobSearchFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState(false);

  useEffect(() => {
    // Initializing filters based on user preferences
    if (user?.jobPreferences) {
      setFilters({
        title:
          user.jobPreferences.titles.length > 0
            ? user.jobPreferences.titles[0]
            : undefined,
        location:
          user.jobPreferences.locations.length > 0
            ? user.jobPreferences.locations[0]
            : undefined,
        remote: user.jobPreferences.remote,
        jobType: user.jobPreferences.jobTypes,
        includeKeywords: user.jobPreferences.includeKeywords,
        excludeKeywords: user.jobPreferences.excludeKeywords,
      });

      if (user.jobPreferences.titles.length > 0) {
        setSearchTerm(user.jobPreferences.titles[0]);
      }

      if (user.jobPreferences.locations.length > 0) {
        setLocation(user.jobPreferences.locations[0]);
      }

      setIsRemote(user.jobPreferences.remote);
    }

    // Load saved job IDs for UI state
    const loadSavedJobs = async () => {
      const savedJobs = await getSavedJobs();
      const savedIds = new Set(savedJobs.map((job) => job.id));
      setSavedJobIds(savedIds);
    };

    loadSavedJobs();
  }, [user]);

  useEffect(() => {
    // Initial search when component mounts
    if (user) {
      handleSearch();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Update filters based on form inputs
      const updatedFilters: JobSearchFilters = {
        ...filters,
        title: searchTerm || undefined,
        location: location || undefined,
        remote: isRemote,
      };

      setFilters(updatedFilters);

      // Search for jobs
      const results = await searchJobs(user, updatedFilters, page);

      // Update search results
      setSearchResults(results.jobs);
      setTotalResults(results.totalResults);

      // Mark saved jobs
      const savedJobs = await getSavedJobs();
      const savedIds = new Set(savedJobs.map((job) => job.id));
      setSavedJobIds(savedIds);

      // Update UI state for each job
      setSearchResults((prevResults) =>
        prevResults.map((job) => ({
          ...job,
          saved: savedIds.has(job.id),
        }))
      );
    } catch (error) {
      console.error("Error searching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (job: Job) => {
    navigate(`/applications?jobId=${job.id}`);
  };

  const handleSave = async () => {
    // Refresh saved job IDs
    const savedJobs = await getSavedJobs();
    const savedIds = new Set(savedJobs.map((job) => job.id));
    setSavedJobIds(savedIds);
  };

  const handleUnsave = async () => {
    // Refresh saved job IDs
    const savedJobs = await getSavedJobs();
    const savedIds = new Set(savedJobs.map((job) => job.id));
    setSavedJobIds(savedIds);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page
    handleSearch();
  };

  const handleLoadMore = () => {
    setPage(page + 1);
    handleSearch();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Search</h1>
        <p className="mt-2 text-gray-600">
          Find jobs that match your skills and preferences.
        </p>
      </div>

      {/* Search Form */}
      <div className="card mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="searchTerm"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Title or Keywords
              </label>
              <input
                type="text"
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full"
                placeholder="e.g., Software Engineer, Product Manager"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field w-full"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isRemote}
                  onChange={() => setIsRemote(!isRemote)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Remote only</span>
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search Jobs"}
            </button>
          </div>
        </form>
      </div>

      {/* Advanced Filters (collapsed by default) */}
      {/* TODO: Add advanced filters such as job type, date posted, salary range, etc. */}

      {/* Search Results */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isLoading ? "Searching..." : `Search Results (${totalResults})`}
          </h2>

          {searchResults.length > 0 && (
            <div className="text-sm text-gray-500">
              Showing {searchResults.length} of {totalResults} jobs
            </div>
          )}
        </div>

        {isLoading && searchResults.length === 0 ? (
          <div className="card flex justify-center items-center py-12">
            <svg
              className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-gray-600 font-medium">
              Searching for jobs...
            </span>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-12">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="text-gray-500 text-center mt-2 max-w-md">
              Try adjusting your search criteria or check back later for new
              postings.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {searchResults.map((job) => (
              <JobCard
                key={job.id}
                job={{
                  ...job,
                  saved: savedJobIds.has(job.id),
                }}
                onSave={handleSave}
                onUnsave={handleUnsave}
                onApply={handleApply}
              />
            ))}

            {searchResults.length < totalResults && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Load More Jobs"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;
