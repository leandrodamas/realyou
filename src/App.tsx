import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/Index';
import SearchPage from './pages/SearchPage';
import ChatsPage from './pages/ChatsPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import FaceRegistrationPage from './pages/FaceRegistrationPage';
import NavBar from './components/layout/NavBar';
import FaceRecognitionPage from "./pages/FaceRecognitionPage";
import { AuthProvider } from './hooks/auth';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'sonner';
import AdvancedSearchPage from './pages/AdvancedSearchPage';
import TimelinePage from './pages/TimelinePage';
import AuthPage from './pages/AuthPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { applyMobileOptimizations } from './utils/mobile';

// Add scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

function App() {
  // Apply mobile optimizations on app initialization
  useEffect(() => {
    applyMobileOptimizations();
  }, []);

  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster position="top-center" richColors />
        <Router>
          <ScrollToTop />
          <div className="App pb-safe">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/advanced-search"
                element={
                  <ProtectedRoute>
                    <AdvancedSearchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chats"
                element={
                  <ProtectedRoute>
                    <ChatsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <OnboardingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/timeline"
                element={
                  <ProtectedRoute>
                    <TimelinePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRoute>
                    <FaceRegistrationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/facial-recognition"
                element={
                  <ProtectedRoute>
                    <FaceRecognitionPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <NavBar />
          </div>
        </Router>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
