import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { Job, ApplicationDetails } from "../types/job";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getSavedJobs } from "../services/jobAggregatorService";
import { autoFillApplication, generateCoverLetter } from "../services/autoFill";
import { getStoredJobData, storeJobData } from "../services/storageService";
import JobCard from "../components/common/JobCard";

const ApplicationTracker: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const statusFilter = searchParams.get("filter");

  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<ApplicationDetails[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [applicationNote, setApplicationNote] = useState("");
  const [applicationStatus, setApplicationStatus] = useState<
    "applied" | "interviewing" | "offered" | "rejected"
  >("applied");

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Get saved jobs
        const jobs = await getSavedJobs();
        setSavedJobs(jobs);

        // Get applications
        const storedApplications =
          (await getStoredJobData<ApplicationDetails[]>("applications")) || [];
        setApplications(storedApplications);

        // If jobId is specified, find that job
        if (jobId) {
          const job = jobs.find((j) => j.id === jobId);
          if (job) {
            setSelectedJob(job);

            // Check if already applied
            const existingApplication = storedApplications.find(
              (a) => a.jobId === jobId
            );
            if (existingApplication) {
              setCoverLetter(existingApplication.coverLetter || "");
              setApplicationNote(existingApplication.notes || "");
              setApplicationStatus(existingApplication.status);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching application data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, jobId]);

  const handleGenerateCoverLetter = async () => {
    if (!selectedJob || !user) return;

    try {
      setIsGeneratingCoverLetter(true);
      const generatedLetter = await generateCoverLetter(selectedJob, user);
      setCoverLetter(generatedLetter);
    } catch (error) {
      console.error("Error generating cover letter:", error);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  const handleApply = async () => {
    if (!selectedJob || !user) return;

    try {
      setIsApplying(true);

      // Auto-fill application (in a real app, this would use browser automation)
      const result = await autoFillApplication({
        jobUrl: selectedJob.url,
        profile: user,
        job: selectedJob,
        coverLetter,
      });

      if (result.success) {
        // Update job status
        const updatedJobs = savedJobs.map((job) =>
          job.id === selectedJob.id
            ? { ...job, applied: true, status: "applied" }
            : job
        );
        await storeJobData("savedJobs", updatedJobs);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setSavedJobs(updatedJobs);

        // Create application record
        const newApplication: ApplicationDetails = {
          jobId: selectedJob.id,
          appliedDate: result.appliedDate || new Date().toISOString(),
          coverLetter,
          applicationUrl: result.applicationUrl,
          notes: applicationNote,
          status: applicationStatus,
        };

        // Save to applications list
        const updatedApplications = [
          ...applications.filter((a) => a.jobId !== selectedJob.id),
          newApplication,
        ];
        await storeJobData("applications", updatedApplications);
        setApplications(updatedApplications);

        // Clear selection
        setSelectedJob(null);
        setCoverLetter("");
        setApplicationNote("");

        // Redirect to applications list
        navigate("/applications");
      } else {
        alert(`Application failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Error applying to job:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleUpdateStatus = async (
    jobId: string,
    newStatus: "applied" | "interviewing" | "offered" | "rejected"
  ) => {
    try {
      // Update application record
      const updatedApplications = applications.map((app) =>
        app.jobId === jobId ? { ...app, status: newStatus } : app
      );
      await storeJobData("applications", updatedApplications);
      setApplications(updatedApplications);

      // Update job record
      const updatedJobs = savedJobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      );
      await storeJobData("savedJobs", updatedJobs);
      setSavedJobs(updatedJobs);
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  // Get job details by ID
  const getJobById = (jobId: string): Job | undefined => {
    return savedJobs.find((job) => job.id === jobId);
  };

  // Filter applications based on status filter
  const filteredApplications = statusFilter
    ? applications.filter((app) => app.status === statusFilter)
    : applications;

  // Sort applications by date (newest first)
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    return (
      new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
    );
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Application Tracker
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your job applications and track your progress.
        </p>
      </div>

      {isLoading ? (
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
          <span className="text-gray-600 font-medium">Loading...</span>
        </div>
      ) : selectedJob ? (
        // Application Form
        <div className="card">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Apply to Job
            </h2>
            <JobCard job={selectedJob} showDetailedView={true} />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900">
                Cover Letter
              </h3>
              <button
                onClick={handleGenerateCoverLetter}
                className="btn-secondary text-sm py-1"
                disabled={isGeneratingCoverLetter}
              >
                {isGeneratingCoverLetter
                  ? "Generating..."
                  : "Generate AI Cover Letter"}
              </button>
            </div>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full h-64 border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write or generate a cover letter for this application..."
            ></textarea>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
            <textarea
              value={applicationNote}
              onChange={(e) => setApplicationNote(e.target.value)}
              className="w-full h-32 border border-gray-300 rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any notes or reminders for this application..."
            ></textarea>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Application Status
            </h3>
            <div className="flex space-x-3">
              {(
                ["applied", "interviewing", "offered", "rejected"] as const
              ).map((status) => (
                <label key={status} className="inline-flex items-center">
                  <input
                    type="radio"
                    checked={applicationStatus === status}
                    onChange={() => setApplicationStatus(status)}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700 capitalize">
                    {status}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => {
                setSelectedJob(null);
                setCoverLetter("");
                setApplicationNote("");
              }}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button
              onClick={handleApply}
              className="btn-primary"
              disabled={isApplying}
            >
              {isApplying ? "Applying..." : "Submit Application"}
            </button>
          </div>
        </div>
      ) : applications.length === 0 ? (
        // No applications
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">
            No applications yet
          </h3>
          <p className="text-gray-500 text-center mt-2 max-w-md">
            Start applying to jobs to track your applications here.
          </p>
          <button
            onClick={() => navigate("/search")}
            className="mt-4 btn-primary"
          >
            Find Jobs to Apply
          </button>
        </div>
      ) : (
        // Application List
        <div>
          <div className="mb-4 flex space-x-2">
            <button
              onClick={() => navigate("/applications")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                !statusFilter
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {(["applied", "interviewing", "offered", "rejected"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => navigate(`/applications?filter=${status}`)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md capitalize ${
                    statusFilter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              )
            )}
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
                  {sortedApplications.map((application) => {
                    const job = getJobById(application.jobId);
                    if (!job) return null;

                    return (
                      <tr key={application.jobId}>
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
                            {new Date(
                              application.appliedDate
                            ).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={application.status}
                            onChange={(e) =>
                              handleUpdateStatus(
                                application.jobId,
                                e.target.value as
                                  | "applied"
                                  | "interviewing"
                                  | "offered"
                                  | "rejected"
                              )
                            }
                            className="form-select text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          >
                            <option value="applied">Applied</option>
                            <option value="interviewing">Interviewing</option>
                            <option value="offered">Offered</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              const job = getJobById(application.jobId);
                              if (job) {
                                setSelectedJob(job);
                                setCoverLetter(application.coverLetter || "");
                                setApplicationNote(application.notes || "");
                                setApplicationStatus(application.status);
                              }
                            }}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            View
                          </button>
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Job Post
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;
