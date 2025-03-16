import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import JobSearch from "./pages/JobSearch";
import ApplicationTracker from "./pages/ApplicationTracker";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import Layout from "./components/common/Layout";
import { UserProvider } from "./contexts/UserContext";
import { getStoredUserData } from "./services/storageService";

function App() {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      const userData = await getStoredUserData();
      setIsOnboarded(!!userData?.onboardingCompleted);
    };

    checkOnboarding();
  }, []);

  return (
    <UserProvider>
      <Routes>
        {!isOnboarded ? (
          <>
            <Route
              path="/onboarding"
              element={<Onboarding onComplete={() => setIsOnboarded(true)} />}
            />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </>
        ) : (
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<JobSearch />} />
            <Route path="/applications" element={<ApplicationTracker />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )}
      </Routes>
    </UserProvider>
  );
}

export default App;
