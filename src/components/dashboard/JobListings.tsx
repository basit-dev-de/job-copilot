// src/components/dashboard/JobListings.tsx
import { useState } from "react";
import { Job } from "../../types/job";
import { Link } from "react-router-dom";

interface JobListingsProps {
  jobs: Job[];
  showFilters?: boolean;
  title: string;
  emptyMessage: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  onApply?: (job: Job) => void;
  onSave?: (job: Job) => void;
  onUnsave?: (jobId: string) => void;
}

const JobListings: React.FC<JobListingsProps> = ({
  jobs,
  showFilters = false,
  title,
  emptyMessage,
  showViewAll = false,
  viewAllLink = "/search",
  onApply,
  onSave,
  onUnsave,
}) => {
  const [sortBy, setSortBy] = useState<"date" | "relevance" | "company">(
    "relevance"
  );
  const [filterStatus, setFilterStatus] = useState<"all" | "saved" | "applied">(
    "all"
  );

  // Sort jobs
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === "date") {
      return (
        new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime()
      );
    } else if (sortBy === "company") {
      return a.company.localeCompare(b.company);
    } else {
      // Sort by AI score (relevance)
      return (b.aiScore || 0) - (a.aiScore || 0);
    }
  });

  // Filter jobs
  const filteredJobs = sortedJobs.filter((job) => {
    if (filterStatus === "saved") return job.saved;
    if (filterStatus === "applied") return job.applied;
    return true;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>

        {showViewAll && jobs.length > 0 && (
          <Link
            to={viewAllLink}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View all ({jobs.length})
          </Link>
        )}
      </div>

      {showFilters && jobs.length > 0 && (
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "all" | "saved" | "applied")
              }
              className="form-select text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="all">All Jobs</option>
              <option value="saved">Saved</option>
              <option value="applied">Applied</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <label className="text-sm text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "relevance" | "company")
              }
              className="form-select text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {job.title}
                  </h3>
                  <p className="text-md text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>

                <div className="flex items-center space-x-3">
                  {job.aiScore !== undefined && (
                    <div
                      className={`text-sm font-medium rounded-full px-2.5 py-1 ${
                        job.aiScore > 80
                          ? "bg-green-100 text-green-800"
                          : job.aiScore > 60
                          ? "bg-blue-100 text-blue-800"
                          : job.aiScore > 40
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      title="AI Match Score"
                    >
                      {job.aiScore}%
                    </div>
                  )}

                  <button
                    onClick={() =>
                      job.saved ? onUnsave?.(job.id) : onSave?.(job)
                    }
                    className={`rounded-full p-1.5 ${
                      job.saved
                        ? "text-yellow-500 hover:text-yellow-600"
                        : "text-gray-400 hover:text-gray-500"
                    }`}
                    title={job.saved ? "Unsave job" : "Save job"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap text-sm text-gray-500">
                {job.salary && (
                  <div className="mr-4 mb-2">
                    <span className="font-medium">Salary:</span> {job.salary}
                  </div>
                )}
                <div className="mr-4 mb-2">
                  <span className="font-medium">Posted:</span>{" "}
                  {formatDate(job.datePosted)}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Source:</span> {job.platform}
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {job.description}
                </p>
              </div>

              <div className="mt-4 flex justify-between">
                <Link
                  to={`/search?jobId=${job.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View details
                </Link>

                {onApply && (
                  <button
                    onClick={() => onApply(job)}
                    className="btn-primary text-sm"
                    disabled={job.applied}
                  >
                    {job.applied ? "Applied" : "Apply Now"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;
