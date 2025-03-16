import { useState } from "react";

interface PlatformsStepProps {
  platforms: {
    linkedin: boolean;
    indeed: boolean;
    glassdoor: boolean;
    other: string[];
  };
  updatePlatforms: (platforms: {
    linkedin: boolean;
    indeed: boolean;
    glassdoor: boolean;
    other: string[];
  }) => void;
  onComplete: () => void;
  onBack: () => void;
}

const PlatformsStep: React.FC<PlatformsStepProps> = ({
  platforms,
  updatePlatforms,
  onComplete,
  onBack,
}) => {
  const [newPlatform, setNewPlatform] = useState("");

  const handleTogglePlatform = (
    platform: "linkedin" | "indeed" | "glassdoor"
  ) => {
    updatePlatforms({ ...platforms, [platform]: !platforms[platform] });
  };

  const handleAddPlatform = () => {
    if (newPlatform.trim() && !platforms.other.includes(newPlatform.trim())) {
      const updatedOther = [...platforms.other, newPlatform.trim()];
      updatePlatforms({ ...platforms, other: updatedOther });
      setNewPlatform("");
    }
  };

  const handleRemovePlatform = (platform: string) => {
    const updatedOther = platforms.other.filter((p) => p !== platform);
    updatePlatforms({ ...platforms, other: updatedOther });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Job Search Platforms</h2>
      <p className="text-gray-600 mb-6">
        Select the platforms you want to search for jobs on.
      </p>

      <div className="space-y-4 mb-6">
        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={platforms.linkedin}
            onChange={() => handleTogglePlatform("linkedin")}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <div className="ml-3">
            <span className="text-gray-900 font-medium">LinkedIn</span>
            <p className="text-gray-500 text-sm">
              Search for jobs posted on LinkedIn
            </p>
          </div>
        </label>

        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={platforms.indeed}
            onChange={() => handleTogglePlatform("indeed")}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <div className="ml-3">
            <span className="text-gray-900 font-medium">Indeed</span>
            <p className="text-gray-500 text-sm">
              Search for jobs posted on Indeed
            </p>
          </div>
        </label>

        <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={platforms.glassdoor}
            onChange={() => handleTogglePlatform("glassdoor")}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <div className="ml-3">
            <span className="text-gray-900 font-medium">Glassdoor</span>
            <p className="text-gray-500 text-sm">
              Search for jobs posted on Glassdoor
            </p>
          </div>
        </label>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Other Platforms
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Add other job boards you want to search
        </p>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="input-field flex-1"
            placeholder="AngelList, Wellfound, etc."
            onKeyDown={(e) => e.key === "Enter" && handleAddPlatform()}
          />
          <button
            type="button"
            onClick={handleAddPlatform}
            className="btn-secondary"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {platforms.other.map((platform, index) => (
            <span
              key={index}
              className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
            >
              {platform}
              <button
                type="button"
                onClick={() => handleRemovePlatform(platform)}
                className="ml-1.5 text-purple-800 hover:text-purple-900"
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
        <button
          type="button"
          onClick={onComplete}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
};

export default PlatformsStep;
