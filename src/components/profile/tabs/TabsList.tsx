
import React from "react";
import { TabsList as ShadcnTabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";

interface TabsListProps {
  activeTab: string;
}

const TabsList: React.FC<TabsListProps> = ({ activeTab }) => {
  return (
    <ShadcnTabsList className="grid grid-cols-4 mx-4 mt-4 p-1 bg-gray-100 rounded-xl">
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
        Sobre
      </TabsTrigger>
      <TabsTrigger 
        value="services"
        className={`rounded-lg ${activeTab === 'services' ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' : ''}`}
      >
        <Calendar className="h-4 w-4 mr-1" />
        Serviços
      </TabsTrigger>
      <TabsTrigger 
        value="achievements"
        className={`rounded-lg ${activeTab === 'achievements' ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' : ''}`}
      >
        Conquistas
      </TabsTrigger>
    </ShadcnTabsList>
  );
};

export default TabsList;
