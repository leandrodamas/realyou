
import React, { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import BusinessCard from "@/components/profile/BusinessCard";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface AboutTabProps {
  isOwner: boolean;
  targetUserId: string;
}

interface ProfileAboutData {
  bio?: string;
  currentPosition?: string;
  company?: string;
  location?: string;
  education?: string;
  skills?: string[];
}

const AboutTab: React.FC<AboutTabProps> = ({ isOwner, targetUserId }) => {
  const [aboutData, setAboutData] = useState<ProfileAboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      if (!targetUserId) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("bio, profession, company, address, education, skills")
          .eq("id", targetUserId)
          .maybeSingle();

        if (error && error.code !== "PGRST116") {
          throw error;
        }
        
        if (data) {
          setAboutData({
            bio: data.bio,
            currentPosition: data.profession,
            company: data.company,
            location: data.address,
            education: data.education,
            skills: data.skills || []
          });
        } else {
          setAboutData({});
        }

      } catch (error) {
        console.error("Error fetching about data:", error);
        toast.error("Erro ao carregar informações do perfil.");
        setAboutData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, [targetUserId]);

  const handleEditBio = () => {
    toast.info("Funcionalidade de edição de bio em desenvolvimento");
  };

  if (isLoading) {
    return (
      <TabsContent value="about" className="px-4 animate-fade-in">
        <Skeleton className="h-[150px] w-full rounded-xl mb-6" /> 
        <Skeleton className="h-[100px] w-full rounded-xl" />
      </TabsContent>
    );
  }

  if (!aboutData) {
    return (
      <TabsContent value="about" className="px-4 animate-fade-in">
        <p className="text-center text-gray-500">Não foi possível carregar as informações.</p>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="about" className="px-4 animate-fade-in">
      <BusinessCard
        currentPosition={aboutData.currentPosition || (isOwner ? "Adicione sua profissão" : "Não informado")}
        company={aboutData.company || ""}
        location={aboutData.location || (isOwner ? "Adicione sua localização" : "Não informado")}
        education={aboutData.education || (isOwner ? "Adicione sua formação" : "Não informado")}
        skills={aboutData.skills && aboutData.skills.length > 0 ? aboutData.skills : (isOwner ? ["Adicione suas habilidades"] : [])}
        isEditable={isOwner}
      />

      <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Bio</h3>
          {isOwner && (
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleEditBio}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="mt-2 text-gray-600 whitespace-pre-wrap">
          {aboutData.bio 
            ? aboutData.bio 
            : (isOwner 
                ? "Adicione uma descrição sobre você e seu trabalho aqui. Isso ajudará seus potenciais clientes a conhecerem melhor você."
                : "Este profissional ainda não adicionou uma bio.")}
        </p>
      </div>
    </TabsContent>
  );
};

export default AboutTab;
