import { useState, useRef } from "react";
import { UserProfile, ExperienceItem, EducationItem } from "../../types/user";

interface ResumeStepProps {
  userData: Partial<UserProfile>;
  updateUserData: (data: Partial<UserProfile>) => void;
  onResumeUpload: (file: File) => Promise<void>;
  onNext: () => void;
  onBack: () => void;
}

const ResumeStep: React.FC<ResumeStepProps> = ({
  userData,
  updateUserData,
  onResumeUpload,
  onNext,
  onBack,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [skills, setSkills] = useState<string[]>(userData.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const [experience] = useState<ExperienceItem[]>(userData.experience || []);
  const [education] = useState<EducationItem[]>(userData.education || []);

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setUploadError("Please upload a PDF or Word document");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      await onResumeUpload(file);
    } catch (error) {
      console.error("Error uploading resume:", error);
      setUploadError("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      updateUserData({ skills: updatedSkills });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    updateUserData({ skills: updatedSkills });
  };

  const handleSubmit = () => {
    updateUserData({
      skills,
      experience,
      education,
    });
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Upload your resume</h2>

      <div className="mb-6">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleResumeChange}
            className="hidden"
            accept=".pdf,.doc,.docx"
          />

          {userData.resume ? (
            <div>
              <p className="text-green-600 font-medium">
                ✓ {userData.resume.name} uploaded
              </p>
              <p className="text-sm text-gray-500 mt-1">Click to replace</p>
            </div>
          ) : (
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-1 text-sm text-gray-600">
                {isUploading
                  ? "Uploading..."
                  : "Upload your resume (PDF or Word)"}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Drag and drop or click to browse
              </p>
            </div>
          )}
        </div>

        {uploadError && (
          <p className="mt-2 text-sm text-red-600">{uploadError}</p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Skills</h3>
        <p className="text-sm text-gray-600 mb-4">
          Add skills that showcase your abilities
        </p>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="input-field flex-1"
            placeholder="Add a skill (e.g., JavaScript, Project Management)"
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="btn-secondary"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
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

      <div className="flex justify-between mt-6">
        <button type="button" onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button type="button" onClick={handleSubmit} className="btn-primary">
          Next
        </button>
      </div>
    </div>
  );
};

export default ResumeStep;
