
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
  
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
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
      console.error("Erro ao carregar perfil do usuário:", error);
    }
  }, []);

  const handleProfileImageChange = (imageData: string) => {
    setProfileImage(imageData);
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const profile = savedProfile ? JSON.parse(savedProfile) : {};
      
      const updatedProfile = {
        ...profile,
        profileImage: imageData
      };
      
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error("Erro ao salvar imagem de perfil:", error);
      toast.error("Não foi possível salvar a foto");
    }
  };

  const handleSubmit = () => {
    if (!fullName.trim()) {
      toast.error("Por favor, preencha seu nome completo");
      return;
    }
    
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const profile = savedProfile ? JSON.parse(savedProfile) : {};
      
      const updatedProfile = {
        ...profile,
        fullName,
        profileImage
      };
      
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      toast.success("Informações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil do usuário:", error);
      toast.error("Erro ao salvar informações");
    }
    
    onComplete();
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
          disabled={!fullName || !profileImage}
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
