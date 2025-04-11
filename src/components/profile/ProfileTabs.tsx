
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileGallery from "@/components/profile/ProfileGallery";
import BusinessCard from "@/components/profile/BusinessCard";
import ProfileAchievements from "@/components/profile/ProfileAchievements";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Edit } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSettings: (section?: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab, openSettings }) => {
  return (
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
  );
};

export default ProfileTabs;
