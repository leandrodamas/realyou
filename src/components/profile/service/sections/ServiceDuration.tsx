
import React, { useState } from "react";
import { Clock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfileStorage } from "@/hooks/facial-recognition/useProfileStorage";
import { toast } from "sonner";

interface ServiceDurationProps {
  duration?: string;
  isOwner?: boolean;
}

const ServiceDuration: React.FC<ServiceDurationProps> = ({ duration = "1 hora", isOwner = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDuration, setEditedDuration] = useState(duration);
  const { saveProfile, getProfile } = useProfileStorage();
  
  const durationOptions = [
    "30 minutos",
    "45 minutos",
    "1 hora",
    "1 hora e 30 minutos",
    "2 horas",
    "3 horas"
  ];
  
  const handleSave = () => {
    try {
      const currentProfile = getProfile() || {};
      saveProfile({
        ...currentProfile,
        serviceDuration: editedDuration
      });
      toast.success("Duração do serviço atualizada!");
      setIsEditing(false);
      
      // Notificar outras partes da aplicação sobre a atualização
      const event = new CustomEvent('profileUpdated', { 
        detail: { profile: {...currentProfile, serviceDuration: editedDuration} } 
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Erro ao atualizar duração do serviço:", error);
      toast.error("Não foi possível atualizar a duração");
    }
  };

  return (
    <div className="flex items-center">
      <Clock className="h-5 w-5 text-purple-600 mr-3" />
      <div className="flex-1">
        <h4 className="font-medium">Duração</h4>
        {isEditing && isOwner ? (
          <div className="flex items-center gap-2 mt-1">
            <Select value={editedDuration} onValueChange={setEditedDuration}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Selecione uma duração" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button size="sm" onClick={handleSave} className="h-8">Salvar</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="h-8">Cancelar</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-gray-600">{duration}</p>
            {isOwner && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}>
                <Edit className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDuration;
