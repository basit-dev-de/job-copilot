import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import BasicInfoStep from "../components/onboarding/BasicInfoStep";
import JobPreferencesStep from "../components/onboarding/JobPreferencesStep";
import ResumeStep from "../components/onboarding/ResumeStep";
import PlatformsStep from "../components/onboarding/PlatformsStep";
import { JobPreferences, UserProfile } from "../types/user";
import { extractResumeText } from "../services/resumeParser";

interface OnboardingProps {
  onComplete: () => void;
}

type OnboardingStep = "basic-info" | "resume" | "job-preferences" | "platforms";

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { setUserProfile } = useUser();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("basic-info");
  const [userData, setUserData] = useState<Partial<UserProfile>>({
    skills: [],
    experience: [],
    education: [],
    jobPreferences: {
      titles: [],
      locations: [],
      remote: false,
      jobTypes: ["full-time"],
      excludeKeywords: [],
      includeKeywords: [],
      platforms: {
        linkedin: true,
        indeed: true,
        glassdoor: false,
        other: [],
      },
    },
  });

  const updateUserData = (data: Partial<UserProfile>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    switch (currentStep) {
      case "basic-info":
        setCurrentStep("resume");
        break;
      case "resume":
        setCurrentStep("job-preferences");
        break;
      case "job-preferences":
        setCurrentStep("platforms");
        break;
      case "platforms":
        completeOnboarding();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "resume":
        setCurrentStep("basic-info");
        break;
      case "job-preferences":
        setCurrentStep("resume");
        break;
      case "platforms":
        setCurrentStep("job-preferences");
        break;
    }
  };

  const completeOnboarding = async () => {
    const completeUserData: UserProfile = {
      ...(userData as UserProfile),
      onboardingCompleted: true,
    };

    await setUserProfile(completeUserData);
    onComplete();
    navigate("/", { replace: true });
  };

  const handleResumeUpload = async (file: File) => {
    try {
      const resumeText = await extractResumeText(file);
      updateUserData({ resume: file, resumeText });
    } catch (error) {
      console.error("Error parsing resume:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to Job Copilot
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            Let's set up your profile to help you find and apply to jobs.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {["basic-info", "resume", "job-preferences", "platforms"].map(
              (step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep === step
                        ? "bg-blue-600 text-white"
                        : index <
                          [
                            "basic-info",
                            "resume",
                            "job-preferences",
                            "platforms",
                          ].indexOf(currentStep)
                        ? "bg-blue-200 text-blue-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="mt-2 text-sm text-gray-600">
                    {step === "basic-info"
                      ? "Basic Info"
                      : step === "resume"
                      ? "Resume"
                      : step === "job-preferences"
                      ? "Job Preferences"
                      : "Platforms"}
                  </span>
                </div>
              )
            )}
          </div>
          <div className="mt-4 h-1 bg-gray-200 w-full">
            <div
              className="h-1 bg-blue-600 transition-all duration-300"
              style={{
                width:
                  currentStep === "basic-info"
                    ? "25%"
                    : currentStep === "resume"
                    ? "50%"
                    : currentStep === "job-preferences"
                    ? "75%"
                    : "100%",
              }}
            />
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-6 mb-6">
          {currentStep === "basic-info" && (
            <BasicInfoStep
              userData={userData}
              updateUserData={updateUserData}
              onNext={handleNext}
            />
          )}

          {currentStep === "resume" && (
            <ResumeStep
              userData={userData}
              updateUserData={updateUserData}
              onResumeUpload={handleResumeUpload}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === "job-preferences" && (
            <JobPreferencesStep
              jobPreferences={userData.jobPreferences as JobPreferences}
              updateJobPreferences={(preferences) =>
                updateUserData({ jobPreferences: preferences })
              }
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === "platforms" && (
            <PlatformsStep
              platforms={
                userData.jobPreferences?.platforms || {
                  linkedin: true,
                  indeed: true,
                  glassdoor: false,
                  other: [],
                }
              }
              updatePlatforms={(platforms) =>
                updateUserData({
                  jobPreferences: {
                    ...(userData.jobPreferences as JobPreferences),
                    platforms,
                  },
                })
              }
              onComplete={completeOnboarding}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
