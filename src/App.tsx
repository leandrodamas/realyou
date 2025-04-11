
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ChatsPage from "./pages/ChatsPage";
import ProfilePage from "./pages/ProfilePage";
import FaceRecognitionPage from "./pages/FaceRecognitionPage";
import FaceRegistrationPage from "./pages/FaceRegistrationPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import NavBar from "./components/layout/NavBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <div className="pb-20"> {/* Added extra padding bottom to accommodate NavBar and center camera button */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chats" element={<ChatsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/face-recognition" element={<FaceRecognitionPage />} />
            <Route path="/register" element={<FaceRegistrationPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <NavBar />
        </div>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
