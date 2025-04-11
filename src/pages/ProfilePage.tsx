
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
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ProfileGallery from "@/components/profile/ProfileGallery";
import ProfileAchievements from "@/components/profile/ProfileAchievements";

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 flex justify-between items-center border-b sticky top-0 z-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Your Profile</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5 text-gray-500" />
        </Button>
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
        >
          <Camera className="h-6 w-6 text-white" />
        </Button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
