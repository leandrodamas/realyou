import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, ArrowRight, Search } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import CBOSearch from "./CBOSearch";

interface PersonalInfoFormProps {
  onComplete: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onComplete }) => {
  const [fullName, setFullName] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showCBOSearch, setShowCBOSearch] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Carregar informações do usuário do localStorage se disponíveis
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        if (profile.fullName) {
          setFullName(profile.fullName);
        } else if (profile.username) {
          // Fallback to username if fullName is not available
          setFullName(profile.username);
        }
        
        if (profile.title) {
          setTitle(profile.title);
        }
        
        if (profile.profileImage) {
          setProfileImage(profile.profileImage);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar perfil do usuário:", error);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setProfileImage(imageDataUrl);

        // Update localStorage with new profile image
        try {
          const savedProfile = localStorage.getItem('userProfile');
          const profile = savedProfile ? JSON.parse(savedProfile) : {};
          
          const updatedProfile = {
            ...profile,
            profileImage: imageDataUrl
          };
          
          localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
          toast.success("Foto de perfil atualizada!");
        } catch (error) {
          console.error("Erro ao salvar imagem de perfil:", error);
          toast.error("Não foi possível salvar a foto");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleTitleSelect = (selectedTitle: string) => {
    setTitle(selectedTitle);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = () => {
    if (!fullName.trim()) {
      toast.error("Por favor, preencha seu nome completo");
      return;
    }
    
    // Atualizar o perfil salvo com novos dados
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const profile = savedProfile ? JSON.parse(savedProfile) : {};
      
      // Update profile data
      const updatedProfile = {
        ...profile,
        fullName,
        title,
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
          onChange={handleNameChange} 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título Profissional
        </label>
        <div className="flex gap-2">
          <Input 
            placeholder="Ex: Designer UX/UI Senior" 
            value={title}
            onChange={handleTitleChange}
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowCBOSearch(true)}
            className="shrink-0"
            type="button"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Pesquise sua profissão no CBO para maior precisão
        </p>
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
          <input 
            type="file" 
            ref={fileInputRef}
            accept="image/*"
            className="hidden" 
            onChange={handleFileChange}
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={triggerFileInput}
          >
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
      
      <CBOSearch 
        open={showCBOSearch} 
        setOpen={setShowCBOSearch}
        onSelect={handleTitleSelect}
      />
    </div>
  );
};

export default PersonalInfoForm;
