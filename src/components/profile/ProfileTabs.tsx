
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileGallery from "@/components/profile/ProfileGallery";
import BusinessCard from "@/components/profile/BusinessCard";
import ProfileAchievements from "@/components/profile/ProfileAchievements";
import ServiceSchedulingSection from "@/components/profile/ServiceSchedulingSection";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Edit, Calendar, Plus } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openSettings: (section?: string) => void;
  isOwner?: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  openSettings,
  isOwner = true 
}) => {
  return (
    <Tabs 
      defaultValue="posts" 
      className="w-full"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-md">
        <TabsList className="grid grid-cols-4 mx-4 mt-4 p-1 bg-gray-100 rounded-xl">
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
        </TabsList>
      </div>

      <TabsContent value="posts" className="p-4 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Publicações</h3>
          {isOwner && (
            <Button variant="outline" size="sm" className="rounded-full flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Nova publicação
            </Button>
          )}
        </div>
        <ProfileGallery isOwner={isOwner} />
      </TabsContent>

      <TabsContent value="about" className="px-4 animate-fade-in">
        <BusinessCard
          currentPosition="Profissional Independente"
          company=""
          location="Sua Localização"
          education="Suas Qualificações"
          skills={["Adicione suas habilidades aqui"]}
          isEditable={isOwner}
        />

        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Bio</h3>
            {isOwner && (
              <Button variant="ghost" size="icon" className="rounded-full">
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-gray-600">
            {isOwner 
              ? "Adicione uma descrição sobre você e seu trabalho aqui. Isso ajudará seus potenciais clientes a conhecerem melhor você."
              : "Este profissional ainda não adicionou uma bio."}
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="services" className="px-4 pb-4 animate-fade-in">
        {isOwner && (
          <div className="mb-4 flex justify-between items-center">
            <h3 className="font-medium">Seus Serviços</h3>
            <Button variant="outline" size="sm" className="rounded-full">
              <Plus className="h-4 w-4 mr-1" />
              Novo Serviço
            </Button>
          </div>
        )}
        <ServiceSchedulingSection isOwner={isOwner} />
      </TabsContent>

      <TabsContent value="achievements" className="px-4 animate-fade-in">
        <ProfileAchievements />
        
        {isOwner && (
          <div className="mt-4 flex justify-end">
            <Link to="/settings" onClick={() => openSettings("achievements")}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Gerenciar Visibilidade das Conquistas
              </Button>
            </Link>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
