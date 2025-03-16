export const extractResumeText = async (file: File): Promise<string> => {
  try {
    // In a real app, you might use a library like pdf.js or docx.js to extract text
    // For this example, we'll just read the file as text
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text || "");
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  } catch (error) {
    console.error("Error extracting text from resume:", error);
    return "";
  }
};
