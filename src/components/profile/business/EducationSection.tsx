
import React from "react";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

interface EducationSectionProps {
  education: string;
}

const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  return (
    <motion.div 
      className="flex items-start"
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="bg-green-100 p-2 rounded-full mr-3">
        <GraduationCap className="h-5 w-5 text-green-600" />
      </div>
      <p className="text-sm">{education}</p>
    </motion.div>
  );
};

export default EducationSection;
