
import React from "react";
import { Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProfessionSectionProps {
  initialProfession: string;
  company: string;
  isEditing?: boolean;
  onProfessionChange?: (value: string) => void;
  onCompanyChange?: (value: string) => void;
}

const ProfessionSection: React.FC<ProfessionSectionProps> = ({
  initialProfession,
  company,
  isEditing = false,
  onProfessionChange,
  onCompanyChange
}) => {
  return (
    <div className="flex space-x-3">
      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
        <Briefcase className="h-4 w-4 text-blue-600" />
      </div>
      <div>
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={initialProfession}
              onChange={(e) => onProfessionChange && onProfessionChange(e.target.value)}
              placeholder="Sua profissão"
              className="h-8 text-sm"
            />
            <Input
              value={company}
              onChange={(e) => onCompanyChange && onCompanyChange(e.target.value)}
              placeholder="Empresa ou organização"
              className="h-8 text-sm"
            />
          </div>
        ) : (
          <>
            <h3 className="text-sm font-medium text-gray-900">{initialProfession}</h3>
            <p className="text-sm text-gray-500">{company}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfessionSection;
