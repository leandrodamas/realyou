import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ChatsPage from './pages/ChatsPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import FaceRegistrationPage from './pages/FaceRegistrationPage';
import NavBar from './components/layout/NavBar';
import FaceRecognitionPage from "./pages/FaceRecognitionPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/register" element={<FaceRegistrationPage />} />
          <Route path="/facial-recognition" element={<FaceRecognitionPage />} />
        </Routes>
        <NavBar />
      </div>
    </Router>
  );
}

export default App;
