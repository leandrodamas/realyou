
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, ArrowRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface PersonalInfoFormProps {
  onComplete: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onComplete }) => {
  const [fullName, setFullName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Carregar informações do usuário do localStorage se disponíveis
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.username) {
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = () => {
    // Atualizar o perfil salvo com novos dados
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        profile.fullName = fullName;
        profile.title = title;
        localStorage.setItem('userProfile', JSON.stringify(profile));
      } else {
        localStorage.setItem('userProfile', JSON.stringify({
          fullName,
          title,
          profileImage
        }));
      }
    } catch (error) {
      console.error("Erro ao salvar perfil do usuário:", error);
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
          onChange={handleNameChange} 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título Profissional
        </label>
        <Input 
          placeholder="Ex: Designer UX/UI Senior" 
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Foto de Perfil
        </label>
        <div className="flex items-center space-x-3">
          {profileImage ? (
            <Avatar className="w-16 h-16">
              <AvatarImage src={profileImage} alt="Perfil" />
              <AvatarFallback>
                {fullName ? fullName.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Camera className="h-6 w-6 text-gray-400" />
            </div>
          )}
          <Button variant="outline" size="sm">
            {profileImage ? "Alterar Foto" : "Fazer Upload"}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Uma boa foto de perfil aumenta as chances de conexões em 80%
        </p>
      </div>
      
      <div className="pt-4">
        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700"
          onClick={handleSubmit}
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
