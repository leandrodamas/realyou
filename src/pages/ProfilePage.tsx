
import React, { useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import BusinessCard from "@/components/profile/BusinessCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Camera, 
  Edit, 
  Sparkles, 
  Award, 
  ThumbsUp,
  Heart,
  MessageCircle, 
  Share2,
  Bookmark,
  Shield,
  Eye,
  Bell,
  Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProfileGallery from "@/components/profile/ProfileGallery";
import ProfileAchievements from "@/components/profile/ProfileAchievements";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("posts");

  const openSettings = (section?: string) => {
    if (section) {
      // We could store the active section in localStorage or context
      // to open the settings directly on that section
      localStorage.setItem("settingsSection", section);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 flex justify-between items-center border-b sticky top-0 z-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Your Profile</h1>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/settings" onClick={() => openSettings("profile-visibility")}>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Shield className="h-5 w-5 text-purple-500" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Privacy Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5 text-gray-500" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Profile Info */}
      <ProfileHeader 
        name="Alex Johnson"
        title="Software Developer"
        avatar="/placeholder.svg"
        postCount={24}
        connectionCount={186}
        skillsCount={12}
      />

      {/* Quick Settings Access */}
      <motion.div 
        className="mx-4 my-3 p-3 bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-600">Quick Settings</h3>
          <Link to="/settings" className="text-xs text-purple-600 font-medium">All Settings</Link>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-3">
          <Link to="/settings" onClick={() => openSettings("profile-visibility")} className="flex flex-col items-center p-2 hover:bg-purple-50 rounded-lg transition-colors">
            <div className="w-9 h-9 flex items-center justify-center bg-purple-100 rounded-full">
              <Shield className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs mt-1 text-center">Privacy</span>
          </Link>
          
          <Link to="/settings" onClick={() => openSettings("story-visibility")} className="flex flex-col items-center p-2 hover:bg-purple-50 rounded-lg transition-colors">
            <div className="w-9 h-9 flex items-center justify-center bg-blue-100 rounded-full">
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs mt-1 text-center">Stories</span>
          </Link>
          
          <Link to="/settings" onClick={() => openSettings("notifications")} className="flex flex-col items-center p-2 hover:bg-purple-50 rounded-lg transition-colors">
            <div className="w-9 h-9 flex items-center justify-center bg-orange-100 rounded-full">
              <Bell className="h-4 w-4 text-orange-600" />
            </div>
            <span className="text-xs mt-1 text-center">Alerts</span>
          </Link>
          
          <Link to="/settings" onClick={() => openSettings("achievements")} className="flex flex-col items-center p-2 hover:bg-purple-50 rounded-lg transition-colors">
            <div className="w-9 h-9 flex items-center justify-center bg-amber-100 rounded-full">
              <Trophy className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-xs mt-1 text-center">Badges</span>
          </Link>
        </div>
      </motion.div>

      {/* Interactive Tabs with Animation */}
      <Tabs 
        defaultValue="posts" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-md">
          <TabsList className="grid grid-cols-3 mx-4 mt-4 p-1 bg-gray-100 rounded-xl">
            <TabsTrigger 
              value="posts"
              className={`rounded-lg ${activeTab === 'posts' ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' : ''}`}
            >
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="about"
              className={`rounded-lg ${activeTab === 'about' ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' : ''}`}
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="achievements"
              className={`rounded-lg ${activeTab === 'achievements' ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' : ''}`}
            >
              Achievements
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="posts" className="p-4 animate-fade-in">
          <ProfileGallery />
        </TabsContent>

        <TabsContent value="about" className="px-4 animate-fade-in">
          <BusinessCard
            currentPosition="Senior Software Developer"
            company="Tech Innovations Inc."
            location="San Francisco, CA"
            education="B.S. Computer Science, Stanford University"
            skills={["React", "TypeScript", "Node.js", "UI/UX Design", "Project Management"]}
          />

          <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Bio</h3>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-gray-600">
              Passionate software developer with a love for creating beautiful user experiences.
              When I'm not coding, you can find me hiking or experimenting with new recipes.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="px-4 animate-fade-in">
          <ProfileAchievements />
          
          <div className="mt-4 flex justify-end">
            <Link to="/settings" onClick={() => openSettings("achievements")}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Manage Achievement Visibility
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>

      {/* Floating Action Button */}
      <motion.div 
        className="fixed bottom-24 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button 
          className="rounded-full h-14 w-14 shadow-lg bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center"
          onClick={() => toast.info("Opening camera...")}
        >
          <Camera className="h-6 w-6 text-white" />
        </Button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
