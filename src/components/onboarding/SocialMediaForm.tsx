
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Facebook, Instagram, Linkedin, Link, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface SocialMediaFormProps {
  onComplete: () => void;
}

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({ onComplete }) => {
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    facebook: "",
    linkedin: "",
    website: ""
  });
  
  const [verifying, setVerifying] = useState<string | null>(null);
  
  const handleChange = (field: string, value: string) => {
    setSocialLinks(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVerify = (platform: string) => {
    if (!socialLinks[platform as keyof typeof socialLinks]) {
      toast.error(`Adicione um link para o ${platform} primeiro`);
      return;
    }
    
    setVerifying(platform);
    
    // Simulate verification
    setTimeout(() => {
      toast.success(`Verificação do ${platform} concluída!`);
      setVerifying(null);
    }, 1500);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h3 className="font-medium text-lg">Conectar Redes Sociais</h3>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
        <div className="flex items-center mb-2">
          <Link className="h-5 w-5 text-blue-600 mr-2" />
          <span className="font-medium">Aumente sua visibilidade!</span>
        </div>
        <p className="text-sm text-gray-600">
          Conecte suas redes sociais para mostrar seu portfólio completo e aumentar sua credibilidade.
          Isso também facilita o compartilhamento do seu trabalho.
        </p>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Instagram className="h-4 w-4 text-pink-600 mr-2" />
            Instagram
          </label>
          <div className="flex">
            <Input 
              placeholder="Seu nome de usuário no Instagram" 
              value={socialLinks.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              className="rounded-r-none"
            />
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-l-none border-l-0"
              onClick={() => handleVerify('instagram')}
              disabled={verifying === 'instagram'}
            >
              {verifying === 'instagram' ? "Verificando..." : "Verificar"}
            </Button>
          </div>
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Facebook className="h-4 w-4 text-blue-600 mr-2" />
            Facebook
          </label>
          <div className="flex">
            <Input 
              placeholder="Link do seu Facebook" 
              value={socialLinks.facebook}
              onChange={(e) => handleChange('facebook', e.target.value)}
              className="rounded-r-none"
            />
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-l-none border-l-0"
              onClick={() => handleVerify('facebook')}
              disabled={verifying === 'facebook'}
            >
              {verifying === 'facebook' ? "Verificando..." : "Verificar"}
            </Button>
          </div>
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Linkedin className="h-4 w-4 text-blue-700 mr-2" />
            LinkedIn
          </label>
          <div className="flex">
            <Input 
              placeholder="Link do seu perfil no LinkedIn" 
              value={socialLinks.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              className="rounded-r-none"
            />
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-l-none border-l-0"
              onClick={() => handleVerify('linkedin')}
              disabled={verifying === 'linkedin'}
            >
              {verifying === 'linkedin' ? "Verificando..." : "Verificar"}
            </Button>
          </div>
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Link className="h-4 w-4 text-gray-600 mr-2" />
            Site ou Portfólio
          </label>
          <div className="flex">
            <Input 
              placeholder="Link do seu site ou portfólio" 
              value={socialLinks.website}
              onChange={(e) => handleChange('website', e.target.value)}
              className="rounded-r-none"
            />
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-l-none border-l-0"
              onClick={() => handleVerify('website')}
              disabled={verifying === 'website'}
            >
              {verifying === 'website' ? "Verificando..." : "Verificar"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700"
          onClick={onComplete}
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SocialMediaForm;
