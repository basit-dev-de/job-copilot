import { useState } from "react";
import { Job } from "../../types/job";
import { saveJob, unsaveJob } from "../../services/jobAggregatorService";

interface JobCardProps {
  job: Job;
  onSave?: () => void;
  onUnsave?: () => void;
  onApply?: (job: Job) => void;
  showDetailedView?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onSave,
  onUnsave,
  onApply,
  showDetailedView = false,
}) => {
  const [isSaved, setIsSaved] = useState(job.saved);
  const [isExpanded, setIsExpanded] = useState(showDetailedView);

  const handleToggleSave = async () => {
    if (isSaved) {
      await unsaveJob(job.id);
      setIsSaved(false);
      onUnsave?.();
    } else {
      await saveJob(job);
      setIsSaved(true);
      onSave?.();
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

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
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden border ${
        job.aiScore && job.aiScore > 80
          ? "border-green-300"
          : job.aiScore && job.aiScore < 50
          ? "border-red-300"
          : "border-gray-200"
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
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
              onClick={handleToggleSave}
              className={`rounded-full p-1.5 ${
                isSaved
                  ? "text-yellow-500 hover:text-yellow-600"
                  : "text-gray-400 hover:text-gray-500"
              }`}
              title={isSaved ? "Unsave job" : "Save job"}
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

        {!isExpanded ? (
          <div className="mt-3">
            <p className="text-sm text-gray-600 line-clamp-2">
              {job.description}
            </p>
            <button
              onClick={handleToggleExpand}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Show more
            </button>
          </div>
        ) : (
          <div className="mt-3">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Description
              </h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Requirements
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.aiMatches && job.aiMatches.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-green-700 mb-2">
                  Skills Match
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.aiMatches.map((match, index) => (
                    <div
                      key={index}
                      className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full"
                    >
                      {match.skill} ({Math.round(match.confidence * 100)}%)
                    </div>
                  ))}
                </div>
              </div>
            )}

            {job.aiMismatches && job.aiMismatches.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-red-700 mb-2">
                  Skill Gaps
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {job.aiMismatches.map((mismatch, index) => (
                    <li key={index} className="text-sm text-red-600">
                      {mismatch.requirement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleToggleExpand}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Show less
            </button>
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View original posting
          </a>

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
    </div>
  );
};

export default JobCard;
