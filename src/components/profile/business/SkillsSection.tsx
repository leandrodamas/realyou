
import React, { useState } from "react";
import { Tag, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SkillsSectionProps {
  skills: string[];
  isEditing?: boolean;
  onSkillsChange?: (skills: string[]) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ 
  skills, 
  isEditing = false,
  onSkillsChange
}) => {
  const [newSkill, setNewSkill] = useState("");
  
  const addSkill = () => {
    if (newSkill.trim() && onSkillsChange) {
      const updatedSkills = [...skills, newSkill.trim()];
      onSkillsChange(updatedSkills);
      setNewSkill("");
    }
  };
  
  const removeSkill = (index: number) => {
    if (onSkillsChange) {
      const updatedSkills = [...skills];
      updatedSkills.splice(index, 1);
      onSkillsChange(updatedSkills);
    }
  };
  
  return (
    <div className="flex space-x-3">
      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
        <Tag className="h-4 w-4 text-amber-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Habilidades</h3>
        
        {isEditing && (
          <div className="flex mb-2 gap-2">
            <Input 
              value={newSkill} 
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Adicionar habilidade"
              className="h-8 text-sm flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button 
              size="sm" 
              onClick={addSkill}
              className="h-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="bg-gray-100"
            >
              {skill}
              {isEditing && (
                <button 
                  onClick={() => removeSkill(index)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  &times;
                </button>
              )}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
