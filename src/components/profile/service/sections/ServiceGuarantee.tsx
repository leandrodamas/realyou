
import React, { useState } from "react";
import { Shield, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useProfileStorage } from "@/hooks/facial-recognition/useProfileStorage";
import { toast } from "sonner";

interface ServiceGuaranteeProps {
  description?: string;
  isOwner?: boolean;
}

const ServiceGuarantee: React.FC<ServiceGuaranteeProps> = ({ 
  description = "Consultoria personalizada para desenvolvimento de software, arquitetura de sistemas e resolução de problemas técnicos. Satisfação garantida ou seu dinheiro de volta.", 
  isOwner = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const { saveProfile, getProfile } = useProfileStorage();
  
  const handleSave = () => {
    try {
      const currentProfile = getProfile() || {};
      saveProfile({
        ...currentProfile,
        serviceDescription: editedDescription
      });
      toast.success("Descrição do serviço atualizada!");
      setIsEditing(false);
      
      // Notificar outras partes da aplicação sobre a atualização
      const event = new CustomEvent('profileUpdated', { 
        detail: { profile: {...currentProfile, serviceDescription: editedDescription} } 
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Erro ao atualizar descrição do serviço:", error);
      toast.error("Não foi possível atualizar a descrição");
    }
  };

  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Shield className="h-4 w-4 text-green-600 mr-1" />
          <span className="text-sm font-medium">RealYou Garantia</span>
        </div>
        {isOwner && !isEditing && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}>
            <Edit className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      
      {isEditing && isOwner ? (
        <div className="space-y-2">
          <Textarea 
            value={editedDescription} 
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Descreva seu serviço e garantia"
            rows={3}
            className="resize-none"
          />
          <div className="flex gap-1">
            <Button size="sm" onClick={handleSave}>Salvar</Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
};

export default ServiceGuarantee;
