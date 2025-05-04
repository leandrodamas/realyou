
import React from "react";
import { GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EducationSectionProps {
  education: string;
  isEditing?: boolean;
  onEducationChange?: (value: string) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({ 
  education,
  isEditing = false,
  onEducationChange
}) => {
  return (
    <div className="flex space-x-3">
      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
        <GraduationCap className="h-4 w-4 text-green-600" />
      </div>
      <div className="flex-1">
        {isEditing ? (
          <Input
            value={education}
            onChange={(e) => onEducationChange && onEducationChange(e.target.value)}
            placeholder="Sua formação acadêmica"
            className="h-8 text-sm"
          />
        ) : (
          <p className="text-sm text-gray-500">{education}</p>
        )}
      </div>
    </div>
  );
};

export default EducationSection;
