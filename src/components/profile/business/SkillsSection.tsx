
import React from "react";
import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface SkillsSectionProps {
  skills: string[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  return (
    <div>
      <div className="flex items-start mb-3">
        <div className="bg-amber-100 p-2 rounded-full mr-3">
          <Award className="h-5 w-5 text-amber-600" />
        </div>
        <p className="font-medium">Skills</p>
      </div>
      <div className="flex flex-wrap gap-2 ml-12">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer transition-colors">
              {skill}
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
