import { useState } from "react";
import { JobPreferences } from "../../types/user";

interface JobPreferencesStepProps {
  jobPreferences: JobPreferences;
  updateJobPreferences: (preferences: JobPreferences) => void;
  onNext: () => void;
  onBack: () => void;
}

const JobPreferencesStep: React.FC<JobPreferencesStepProps> = ({
  jobPreferences,
  updateJobPreferences,
  onNext,
  onBack,
}) => {
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newIncludeKeyword, setNewIncludeKeyword] = useState("");
  const [newExcludeKeyword, setNewExcludeKeyword] = useState("");

  const handleAddJobTitle = () => {
    if (
      newJobTitle.trim() &&
      !jobPreferences.titles.includes(newJobTitle.trim())
    ) {
      const updatedTitles = [...jobPreferences.titles, newJobTitle.trim()];
      updateJobPreferences({ ...jobPreferences, titles: updatedTitles });
      setNewJobTitle("");
    }
  };

  const handleRemoveJobTitle = (title: string) => {
    const updatedTitles = jobPreferences.titles.filter((t) => t !== title);
    updateJobPreferences({ ...jobPreferences, titles: updatedTitles });
  };

  const handleAddLocation = () => {
    if (
      newLocation.trim() &&
      !jobPreferences.locations.includes(newLocation.trim())
    ) {
      const updatedLocations = [
        ...jobPreferences.locations,
        newLocation.trim(),
      ];
      updateJobPreferences({ ...jobPreferences, locations: updatedLocations });
      setNewLocation("");
    }
  };

  const handleRemoveLocation = (location: string) => {
    const updatedLocations = jobPreferences.locations.filter(
      (l) => l !== location
    );
    updateJobPreferences({ ...jobPreferences, locations: updatedLocations });
  };

  const handleAddIncludeKeyword = () => {
    if (
      newIncludeKeyword.trim() &&
      !jobPreferences.includeKeywords.includes(newIncludeKeyword.trim())
    ) {
      const updatedKeywords = [
        ...jobPreferences.includeKeywords,
        newIncludeKeyword.trim(),
      ];
      updateJobPreferences({
        ...jobPreferences,
        includeKeywords: updatedKeywords,
      });
      setNewIncludeKeyword("");
    }
  };

  const handleRemoveIncludeKeyword = (keyword: string) => {
    const updatedKeywords = jobPreferences.includeKeywords.filter(
      (k) => k !== keyword
    );
    updateJobPreferences({
      ...jobPreferences,
      includeKeywords: updatedKeywords,
    });
  };

  const handleAddExcludeKeyword = () => {
    if (
      newExcludeKeyword.trim() &&
      !jobPreferences.excludeKeywords.includes(newExcludeKeyword.trim())
    ) {
      const updatedKeywords = [
        ...jobPreferences.excludeKeywords,
        newExcludeKeyword.trim(),
      ];
      updateJobPreferences({
        ...jobPreferences,
        excludeKeywords: updatedKeywords,
      });
      setNewExcludeKeyword("");
    }
  };

  const handleRemoveExcludeKeyword = (keyword: string) => {
    const updatedKeywords = jobPreferences.excludeKeywords.filter(
      (k) => k !== keyword
    );
    updateJobPreferences({
      ...jobPreferences,
      excludeKeywords: updatedKeywords,
    });
  };

  const handleToggleRemote = () => {
    updateJobPreferences({ ...jobPreferences, remote: !jobPreferences.remote });
  };

  const handleToggleJobType = (
    type: "full-time" | "part-time" | "contract" | "internship"
  ) => {
    const updatedJobTypes = jobPreferences.jobTypes.includes(type)
      ? jobPreferences.jobTypes.filter((t) => t !== type)
      : [...jobPreferences.jobTypes, type];

    updateJobPreferences({ ...jobPreferences, jobTypes: updatedJobTypes });
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    updateJobPreferences({
      ...jobPreferences,
      minSalary: isNaN(value) ? undefined : value,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Job Preferences</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Job Titles</h3>
        <p className="text-sm text-gray-600 mb-4">
          Add job titles you're interested in
        </p>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newJobTitle}
            onChange={(e) => setNewJobTitle(e.target.value)}
            className="input-field flex-1"
            placeholder="Software Engineer, Product Manager, etc."
            onKeyDown={(e) => e.key === "Enter" && handleAddJobTitle()}
          />
          <button
            type="button"
            onClick={handleAddJobTitle}
            className="btn-secondary"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {jobPreferences.titles.map((title, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
            >
              {title}
              <button
                type="button"
                onClick={() => handleRemoveJobTitle(title)}
                className="ml-1.5 text-blue-800 hover:text-blue-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Locations</h3>
        <p className="text-sm text-gray-600 mb-4">
          Add locations where you want to work
        </p>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            className="input-field flex-1"
            placeholder="San Francisco, CA; New York, NY; etc."
            onKeyDown={(e) => e.key === "Enter" && handleAddLocation()}
          />
          <button
            type="button"
            onClick={handleAddLocation}
            className="btn-secondary"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {jobPreferences.locations.map((location, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
            >
              {location}
              <button
                type="button"
                onClick={() => handleRemoveLocation(location)}
                className="ml-1.5 text-blue-800 hover:text-blue-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>

        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={jobPreferences.remote}
              onChange={handleToggleRemote}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Include remote jobs</span>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Job Types</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select the types of jobs you're looking for
        </p>

        <div className="space-y-2">
          {(["full-time", "part-time", "contract", "internship"] as const).map(
            (type) => (
              <label key={type} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  checked={jobPreferences.jobTypes.includes(type)}
                  onChange={() => handleToggleJobType(type)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700 capitalize">{type}</span>
              </label>
            )
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Minimum Salary (Annual, USD)
        </h3>
        <input
          type="number"
          value={jobPreferences.minSalary || ""}
          onChange={handleSalaryChange}
          className="input-field w-full"
          placeholder="e.g., 100000"
          min="0"
          step="5000"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Keywords to Include
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Add keywords you want to see in job postings
        </p>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newIncludeKeyword}
            onChange={(e) => setNewIncludeKeyword(e.target.value)}
            className="input-field flex-1"
            placeholder="Python, management, startup, etc."
            onKeyDown={(e) => e.key === "Enter" && handleAddIncludeKeyword()}
          />
          <button
            type="button"
            onClick={handleAddIncludeKeyword}
            className="btn-secondary"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {jobPreferences.includeKeywords.map((keyword, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
            >
              {keyword}
              <button
                type="button"
                onClick={() => handleRemoveIncludeKeyword(keyword)}
                className="ml-1.5 text-green-800 hover:text-green-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Keywords to Exclude
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Add keywords you don't want to see in job postings
        </p>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newExcludeKeyword}
            onChange={(e) => setNewExcludeKeyword(e.target.value)}
            className="input-field flex-1"
            placeholder="Unpaid, internship, etc."
            onKeyDown={(e) => e.key === "Enter" && handleAddExcludeKeyword()}
          />
          <button
            type="button"
            onClick={handleAddExcludeKeyword}
            className="btn-secondary"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {jobPreferences.excludeKeywords.map((keyword, index) => (
            <span
              key={index}
              className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
            >
              {keyword}
              <button
                type="button"
                onClick={() => handleRemoveExcludeKeyword(keyword)}
                className="ml-1.5 text-red-800 hover:text-red-900"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button type="button" onClick={onNext} className="btn-primary">
          Next
        </button>
      </div>
    </div>
  );
};

export default JobPreferencesStep;
