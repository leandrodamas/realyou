
import React from "react";
import { Switch } from "@/components/ui/switch";

interface PublicToggleProps {
  showPublicly: boolean;
  onChange: (value: boolean) => void;
}

const PublicToggle: React.FC<PublicToggleProps> = ({ showPublicly, onChange }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
      <div>
        <h3 className="font-medium">Mostrar serviços publicamente</h3>
        <p className="text-sm text-gray-500">Permite que outros usuários vejam seus serviços e disponibilidade</p>
      </div>
      <Switch
        checked={showPublicly}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-purple-600"
      />
    </div>
  );
};

export default PublicToggle;
