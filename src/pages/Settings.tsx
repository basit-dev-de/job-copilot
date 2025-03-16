import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { clearAllData } from "../services/storageService";
import { JobPreferences } from "../types/user";

const Settings: React.FC = () => {
  const { user, updateUser, isLoading } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [isDataClearing, setIsDataClearing] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [jobPreferences, setJobPreferences] = useState<JobPreferences | null>(
    null
  );
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  // Initialize form with user data
  useEffect(() => {
    if (user && !isLoading) {
      setJobPreferences(user.jobPreferences);
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
      });
    }
  }, [user, isLoading]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleTogglePlatform = (
    platform: "linkedin" | "indeed" | "glassdoor"
  ) => {
    if (!jobPreferences) return;

    setJobPreferences({
      ...jobPreferences,
      platforms: {
        ...jobPreferences.platforms,
        [platform]: !jobPreferences.platforms[platform],
      },
    });
  };

  const handleToggleRemote = () => {
    if (!jobPreferences) return;

    setJobPreferences({
      ...jobPreferences,
      remote: !jobPreferences.remote,
    });
  };

  const handleSaveSettings = async () => {
    if (!user || !jobPreferences) return;

    try {
      setIsSaving(true);

      // Update user profile and preferences
      await updateUser({
        ...profile,
        jobPreferences,
      });

      // Show success message
      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearData = async () => {
    try {
      setIsDataClearing(true);

      // Clear all stored data
      await clearAllData();

      // Reload the page to reset the app state
      window.location.href = "/onboarding";
    } catch (error) {
      console.error("Error clearing data:", error);
      setIsDataClearing(false);
    }
  };

  if (isLoading || !user || !jobPreferences) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your profile and job search preferences.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      <div className="space-y-8">
        {/* Profile Settings */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="input-field w-full"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="input-field w-full"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                className="input-field w-full"
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
                name="location"
                value={profile.location}
                onChange={handleProfileChange}
                className="input-field w-full"
              />
            </div>
          </div>
        </div>

        {/* Job Preferences */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Job Preferences
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Job Titles
            </h3>
            <div className="flex flex-wrap gap-2">
              {jobPreferences.titles.map((title, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {title}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              You can update job titles in the onboarding flow.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Locations
            </h3>
            <div className="flex flex-wrap gap-2">
              {jobPreferences.locations.map((location, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {location}
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
                  checked={jobPreferences.platforms.glassdoor}
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
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Included Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {jobPreferences.includeKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
              {jobPreferences.includeKeywords.length === 0 && (
                <span className="text-sm text-gray-500">
                  No included keywords set
                </span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Excluded Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {jobPreferences.excludeKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
              {jobPreferences.excludeKeywords.length === 0 && (
                <span className="text-sm text-gray-500">
                  No excluded keywords set
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Application Settings */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Application Settings
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Auto-fill Settings
            </h3>
            <p className="text-gray-600 mb-4">
              Job Copilot uses your profile information to auto-fill job
              applications. You can customize these settings here.
            </p>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={true}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">
                  Use browser automation to auto-fill forms
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={true}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">
                  Use AI to generate custom cover letters
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={true}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">
                  Use proxies to avoid rate limiting
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Data Management
          </h2>

          <p className="text-gray-600 mb-4">
            Job Copilot stores all your data locally in your browser. You can
            clear all data at any time.
          </p>

          {!showConfirmClear ? (
            <button
              onClick={() => setShowConfirmClear(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Clear All Data
            </button>
          ) : (
            <div>
              <p className="text-red-600 font-medium mb-4">
                Are you sure? This will delete all your saved jobs,
                applications, and settings.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleClearData}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  disabled={isDataClearing}
                >
                  {isDataClearing ? "Clearing..." : "Yes, Clear Everything"}
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="btn-primary"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
