
import React from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import BusinessCard from "@/components/profile/BusinessCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from "lucide-react";

const ProfilePage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 flex justify-between items-center border-b">
        <h1 className="text-xl font-bold">Profile</h1>
        <Settings className="h-5 w-5 text-gray-500" />
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

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="p-4">
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="aspect-square bg-gray-200">
                <img
                  src="/placeholder.svg"
                  alt={`Post ${item}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="about" className="px-4">
          <BusinessCard
            currentPosition="Senior Software Developer"
            company="Tech Innovations Inc."
            location="San Francisco, CA"
            education="B.S. Computer Science, Stanford University"
            skills={["React", "TypeScript", "Node.js", "UI/UX Design", "Project Management"]}
          />
        </TabsContent>
        <TabsContent value="skills" className="p-4">
          <div className="space-y-4">
            {["Programming", "Design", "Management"].map((category) => (
              <div key={category} className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium mb-2">{category}</h3>
                <div className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex justify-between">
                      <span>Skill {item}</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-whatsapp h-2 rounded-full" 
                          style={{ width: `${Math.random() * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
