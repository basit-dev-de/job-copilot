import localforage from "localforage";
import { UserProfile } from "../types/user";

// Configure localforage
localforage.config({
  name: "JobCopilot",
  storeName: "user_data",
});

export const storeUserData = async (userData: UserProfile): Promise<void> => {
  try {
    await localforage.setItem("userData", userData);
  } catch (error) {
    console.error("Error storing user data:", error);
    throw error;
  }
};

export const getStoredUserData = async (): Promise<UserProfile | null> => {
  try {
    const userData = await localforage.getItem<UserProfile>("userData");
    return userData;
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const storeJobData = async (key: string, data: any): Promise<void> => {
  try {
    await localforage.setItem(key, data);
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    throw error;
  }
};

export const getStoredJobData = async <T>(key: string): Promise<T | null> => {
  try {
    return await localforage.getItem<T>(key);
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return null;
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await localforage.clear();
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
};
