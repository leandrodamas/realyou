
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkGallery } from "./hooks/useWorkGallery";
import { UploadWorkDialog } from "./components/UploadWorkDialog";
import { WorkItem } from "./components/WorkItem";

const ProfileGallery: React.FC = () => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { items, reloadGallery } = useWorkGallery();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button 
          onClick={() => setShowUploadDialog(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Trabalho
        </Button>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {items.map((item) => (
          <WorkItem key={item.id} item={item} />
        ))}
      </motion.div>

      <UploadWorkDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUploadSuccess={reloadGallery}
      />
    </>
  );
};

export default ProfileGallery;
