
import React, { useState } from "react";
import { Briefcase, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ProfessionSectionProps {
  initialProfession: string;
  company: string;
}

const ProfessionSection: React.FC<ProfessionSectionProps> = ({
  initialProfession,
  company,
}) => {
  const [isEditingProfession, setIsEditingProfession] = useState(false);
  const [profession, setProfession] = useState(initialProfession);

  const handleSaveProfession = () => {
    setIsEditingProfession(false);
    toast.success("Profissão atualizada com sucesso!");
  };

  return (
    <motion.div 
      className="flex items-start"
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="bg-purple-100 p-2 rounded-full mr-3">
        <Briefcase className="h-5 w-5 text-purple-600" />
      </div>
      <div className="flex-1">
        {isEditingProfession ? (
          <div className="flex gap-2">
            <Input 
              value={profession} 
              onChange={(e) => setProfession(e.target.value)} 
              className="h-8 text-sm"
            />
            <Button size="sm" onClick={handleSaveProfession}>Salvar</Button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{profession}</p>
              <p className="text-sm text-gray-500">{company}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => setIsEditingProfession(true)}
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfessionSection;
