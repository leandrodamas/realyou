
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PublicToggleProps {
  showPublicly: boolean;
  onChange: (value: boolean) => void;
}

const PublicToggle: React.FC<PublicToggleProps> = ({ showPublicly, onChange }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5 text-gray-500" />
        <div>
          <Label htmlFor="public-toggle" className="font-medium">
            Mostrar publicamente
          </Label>
          <p className="text-sm text-gray-500">
            Seu perfil aparecerá nas buscas
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={showPublicly ? "default" : "secondary"}>
          {showPublicly ? "Visível" : "Privado"}
        </Badge>
        <Switch
          id="public-toggle"
          checked={showPublicly}
          onCheckedChange={onChange}
        />
      </div>
    </div>
  );
};

export default PublicToggle;
