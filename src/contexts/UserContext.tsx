import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserProfile } from "../types/user";
import { getStoredUserData, storeUserData } from "../services/storageService";

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  setUserProfile: (profile: UserProfile) => Promise<void>;
}

const defaultUserContext: UserContextType = {
  user: null,
  isLoading: true,
  updateUser: async () => {},
  setUserProfile: async () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getStoredUserData();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const updateUser = async (data: Partial<UserProfile>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    await storeUserData(updatedUser);
  };

  const setUserProfile = async (profile: UserProfile) => {
    setUser(profile);
    await storeUserData(profile);
  };

  return (
    <UserContext.Provider
      value={{ user, isLoading, updateUser, setUserProfile }}
    >
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);
