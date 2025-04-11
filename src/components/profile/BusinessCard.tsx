
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import BusinessCardHeader from "./business/BusinessCardHeader";
import ProfessionSection from "./business/ProfessionSection";
import LocationSection from "./business/LocationSection";
import EducationSection from "./business/EducationSection";
import AvailabilitySection from "./business/AvailabilitySection";
import SkillsSection from "./business/SkillsSection";

interface BusinessCardProps {
  currentPosition: string;
  company: string;
  location: string;
  education: string;
  skills: string[];
}

const BusinessCard: React.FC<BusinessCardProps> = ({
  currentPosition,
  company,
  location,
  education,
  skills,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <BusinessCardHeader />
        <CardContent className="space-y-4">
          <ProfessionSection 
            initialProfession={currentPosition} 
            company={company} 
          />
          
          <LocationSection location={location} />
          
          <EducationSection education={education} />
          
          <AvailabilitySection />
          
          <SkillsSection skills={skills} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BusinessCard;
