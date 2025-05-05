
import React, { useState } from "react";
import { MapPin, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; 
import { useProfileStorage } from "@/hooks/facial-recognition/useProfileStorage";
import { toast } from "sonner";

interface ServiceLocationProps {
  location?: string;
  isOwner?: boolean;
}

const ServiceLocation: React.FC<ServiceLocationProps> = ({ location = "Online (via chamada de vídeo)", isOwner = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [locationType, setLocationType] = useState(location.includes("Online") ? "online" : "presencial");
  const [customLocation, setCustomLocation] = useState(location.includes("presencial") ? location.replace("Presencial: ", "") : "");
  const { saveProfile, getProfile } = useProfileStorage();
  
  const handleSave = () => {
    try {
      const finalLocation = locationType === "online" 
        ? "Online (via chamada de vídeo)" 
        : `Presencial: ${customLocation}`;
      
      const currentProfile = getProfile() || {};
      saveProfile({
        ...currentProfile,
        serviceLocation: finalLocation
      });
      toast.success("Local do serviço atualizado!");
      setIsEditing(false);
      
      // Notificar outras partes da aplicação sobre a atualização
      const event = new CustomEvent('profileUpdated', { 
        detail: { profile: {...currentProfile, serviceLocation: finalLocation} } 
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Erro ao atualizar local do serviço:", error);
      toast.error("Não foi possível atualizar o local");
    }
  };

  return (
    <div className="flex items-center">
      <MapPin className="h-5 w-5 text-red-500 mr-3" />
      <div className="flex-1">
        <h4 className="font-medium">Local</h4>
        {isEditing && isOwner ? (
          <div className="mt-2 space-y-3">
            <RadioGroup value={locationType} onValueChange={setLocationType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="text-sm">Online (via chamada de vídeo)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="presencial" id="presencial" />
                <Label htmlFor="presencial" className="text-sm">Presencial</Label>
              </div>
            </RadioGroup>
            
            {locationType === "presencial" && (
              <Input 
                value={customLocation} 
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Informe o endereço"
                className="h-8 mt-1"
              />
            )}
            
            <div className="flex gap-1">
              <Button size="sm" onClick={handleSave}>Salvar</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-gray-600">{location}</p>
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

export default ServiceLocation;
