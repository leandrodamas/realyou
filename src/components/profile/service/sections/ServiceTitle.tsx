
import React, { useState } from "react";
import { Award, ThumbsUp, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfileStorage } from "@/hooks/facial-recognition/useProfileStorage";
import { toast } from "sonner";

interface ServiceTitleProps {
  title?: string;
  isOwner?: boolean;
}

const ServiceTitle: React.FC<ServiceTitleProps> = ({ title = "Consultoria de Software", isOwner = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const { saveProfile, getProfile } = useProfileStorage();

  const handleSave = () => {
    try {
      const currentProfile = getProfile() || {};
      saveProfile({
        ...currentProfile,
        serviceName: editedTitle
      });
      toast.success("Nome do serviço atualizado!");
      setIsEditing(false);
      
      // Notificar outras partes da aplicação sobre a atualização
      const event = new CustomEvent('profileUpdated', { 
        detail: { profile: {...currentProfile, serviceName: editedTitle} } 
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Erro ao atualizar nome do serviço:", error);
      toast.error("Não foi possível atualizar o nome do serviço");
    }
  };

  return (
    <div className="flex items-start">
      <Award className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
      <div className="flex-1">
        {isEditing && isOwner ? (
          <div className="flex items-center gap-2">
            <Input 
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="h-8"
            />
            <Button size="sm" onClick={handleSave}>Salvar</Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{title}</h4>
            {isOwner && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-1 mt-1">
          <p className="text-xs text-gray-500">Superstar • Escolha da Semana</p>
          <Badge variant="outline" className="text-[10px] border-purple-200 bg-purple-50 text-purple-700">
            <ThumbsUp className="h-2.5 w-2.5 mr-0.5" />
            98% de aprovação
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ServiceTitle;
