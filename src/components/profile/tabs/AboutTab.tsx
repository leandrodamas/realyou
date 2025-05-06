
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import BusinessCard from "@/components/profile/BusinessCard";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface AboutTabProps {
  isOwner: boolean;
}

const AboutTab: React.FC<AboutTabProps> = ({ isOwner }) => {
  return (
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
  );
};

export default AboutTab;
