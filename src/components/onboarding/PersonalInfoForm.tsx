
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import ProfileImageUpload from "./ProfileImageUpload";

interface PersonalInfoFormProps {
  onComplete: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onComplete }) => {
  const [fullName, setFullName] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        console.log("PersonalInfoForm: Carregando perfil:", profile);
        
        if (profile.fullName) {
          setFullName(profile.fullName);
        } else if (profile.username) {
          setFullName(profile.username);
        }
        
        if (profile.profileImage) {
          setProfileImage(profile.profileImage);
        }
      }
    } catch (error) {
      console.error("PersonalInfoForm: Erro ao carregar perfil do usuário:", error);
      toast.error("Erro ao carregar perfil");
    }
  }, []);

  const handleProfileImageChange = (imageData: string) => {
    setProfileImage(imageData);
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const profile = savedProfile ? JSON.parse(savedProfile) : {};
      
      const updatedProfile = {
        ...profile,
        profileImage: imageData,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      console.log("PersonalInfoForm: Imagem de perfil atualizada:", updatedProfile);
      
      // Atualizar também a imagem temporária para uso em outros componentes
      localStorage.setItem('tempCapturedImage', imageData);
      
      // Use a slight delay to ensure storage is updated before event dispatch
      setTimeout(() => {
        // Notificar outros componentes sobre a atualização do perfil
        try {
          document.dispatchEvent(new CustomEvent('profileUpdated', { 
            detail: { 
              profile: updatedProfile 
            }
          }));
        } catch (error) {
          console.error("PersonalInfoForm: Erro ao disparar evento de atualização:", error);
        }
      }, 300);
    } catch (error) {
      console.error("PersonalInfoForm: Erro ao salvar imagem de perfil:", error);
      toast.error("Não foi possível salvar a foto");
    }
  };

  const handleSubmit = () => {
    if (!fullName.trim()) {
      toast.error("Por favor, preencha seu nome completo");
      return;
    }
    
    if (!profileImage) {
      toast.error("Por favor, adicione uma foto de perfil");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const profile = savedProfile ? JSON.parse(savedProfile) : {};
      
      const updatedProfile = {
        ...profile,
        fullName,
        profileImage,
        lastUpdated: new Date().toISOString(),
        profileComplete: true
      };
      
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      console.log("PersonalInfoForm: Perfil completado:", updatedProfile);
      toast.success("Informações salvas com sucesso!");
      
      // Garantir que o perfil seja salvo antes de prosseguir
      try {
        // Disparar evento de atualização de perfil e aguardar um pouco
        document.dispatchEvent(new CustomEvent('profileUpdated', { 
          detail: { 
            profile: updatedProfile 
          }
        }));
        
        // Aguardar um pouco para que os outros componentes possam processar o evento
        setTimeout(() => {
          setIsSubmitting(false);
          onComplete();
        }, 500);
      } catch (error) {
        console.error("PersonalInfoForm: Erro ao disparar evento de atualização de perfil:", error);
        setIsSubmitting(false);
        onComplete(); // Continuar de qualquer forma se houver erro
      }
    } catch (error) {
      console.error("PersonalInfoForm: Erro ao salvar perfil do usuário:", error);
      toast.error("Erro ao salvar informações");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h3 className="font-medium text-lg">Informações Básicas</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome Completo
        </label>
        <Input 
          placeholder="Seu nome completo" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
        />
      </div>
      
      <ProfileImageUpload
        profileImage={profileImage}
        fullName={fullName}
        onChange={handleProfileImageChange}
      />
      
      <div className="pt-4">
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={handleSubmit}
          disabled={!fullName || !profileImage || isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Continuar"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
