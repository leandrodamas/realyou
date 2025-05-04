
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import BusinessCardHeader from "./business/BusinessCardHeader";
import ProfessionSection from "./business/ProfessionSection";
import LocationSection from "./business/LocationSection";
import EducationSection from "./business/EducationSection";
import AvailabilitySection from "./business/AvailabilitySection";
import SkillsSection from "./business/SkillsSection";
import { Button } from "@/components/ui/button";
import { Edit2, Save } from "lucide-react";
import { toast } from "sonner";
import { useProfileStorage } from "@/hooks/facial-recognition/useProfileStorage";

interface BusinessCardProps {
  currentPosition: string;
  company: string;
  location: string;
  education: string;
  skills: string[];
  isEditable?: boolean;
}

const BusinessCard: React.FC<BusinessCardProps> = ({
  currentPosition,
  company,
  location,
  education,
  skills,
  isEditable = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPosition, setEditedPosition] = useState(currentPosition);
  const [editedCompany, setEditedCompany] = useState(company);
  const [editedLocation, setEditedLocation] = useState(location);
  const [editedEducation, setEditedEducation] = useState(education);
  const [editedSkills, setEditedSkills] = useState<string[]>(skills);
  
  const { saveProfile, getProfile } = useProfileStorage();
  
  const handleSaveChanges = () => {
    try {
      const currentProfile = getProfile() || {};
      const updatedProfile = {
        ...currentProfile,
        profession: editedPosition,
        company: editedCompany,
        location: editedLocation,
        education: editedEducation,
        skills: editedSkills
      };
      
      saveProfile(updatedProfile);
      toast.success("Informações profissionais atualizadas!");
      setIsEditing(false);
      
      // Dispatch event to notify other components
      const event = new CustomEvent('profileUpdated', { 
        detail: { profile: updatedProfile } 
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Erro ao atualizar informações profissionais:", error);
      toast.error("Não foi possível atualizar suas informações");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <BusinessCardHeader />
        <CardContent className="space-y-4">
          {isEditable && (
            <div className="flex justify-end">
              {isEditing ? (
                <Button 
                  size="sm" 
                  onClick={handleSaveChanges}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          )}
          
          <ProfessionSection 
            initialProfession={editedPosition} 
            company={editedCompany}
            isEditing={isEditing && isEditable}
            onProfessionChange={setEditedPosition}
            onCompanyChange={setEditedCompany}
          />
          
          <LocationSection 
            location={editedLocation}
            isEditing={isEditing && isEditable}
            onLocationChange={setEditedLocation}
          />
          
          <EducationSection 
            education={editedEducation}
            isEditing={isEditing && isEditable}
            onEducationChange={setEditedEducation}
          />
          
          <AvailabilitySection />
          
          <SkillsSection 
            skills={editedSkills}
            isEditing={isEditing && isEditable}
            onSkillsChange={setEditedSkills}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BusinessCard;
