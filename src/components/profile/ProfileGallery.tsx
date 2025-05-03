
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Share2, Instagram, Facebook, LinkIcon, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkGallery } from "./hooks/useWorkGallery";
import { UploadWorkDialog } from "./components/UploadWorkDialog";
import { WorkItem } from "./components/WorkItem";
import { WorkItemErrorBoundary } from "./components/WorkItemErrorBoundary";
import { WorkItemSkeleton } from "./components/WorkItemSkeleton";
import { toast } from "sonner";

interface ProfileGalleryProps {
  isOwner?: boolean;
}

const ProfileGallery: React.FC<ProfileGalleryProps> = ({ isOwner = true }) => {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const { items, reloadGallery, isLoading } = useWorkGallery();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleShareOnSocial = (platform: string) => {
    toast.success(`Compartilhado no ${platform}!`);
    setShowSocialShare(false);
  };

  const handleVerifyCertification = () => {
    toast.success("Certificação verificada com sucesso!");
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex gap-2 transition-all ${showSocialShare ? 'opacity-100' : 'opacity-0'}`}
        >
          <Button 
            size="sm" 
            variant="outline"
            className="bg-gradient-to-r from-purple-50 to-pink-50 border-pink-200"
            onClick={() => handleShareOnSocial('Instagram')}
          >
            <Instagram className="h-4 w-4 mr-2 text-pink-600" />
            Instagram
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
            onClick={() => handleShareOnSocial('Facebook')}
          >
            <Facebook className="h-4 w-4 mr-2 text-blue-600" />
            Facebook
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200"
            onClick={handleVerifyCertification}
          >
            <BadgeCheck className="h-4 w-4 mr-2 text-green-600" />
            Verificar
          </Button>
        </motion.div>
        {isOwner && (
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowSocialShare(!showSocialShare)}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Integrar
            </Button>
            <Button 
              onClick={() => setShowUploadDialog(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Trabalho
            </Button>
          </div>
        )}
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <WorkItemSkeleton key={index} />
          ))
        ) : items.length > 0 ? (
          items.map((item) => (
            <WorkItemErrorBoundary key={item.id}>
              <WorkItem item={item} />
            </WorkItemErrorBoundary>
          ))
        ) : (
          <motion.div 
            className="col-span-full flex flex-col items-center justify-center p-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <LinkIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Comece a compartilhar seu trabalho</h3>
            <p className="text-gray-500 mb-4">Adicione imagens dos seus trabalhos para mostrar suas habilidades e conectar-se com outros profissionais</p>
            {isOwner && (
              <Button 
                onClick={() => setShowUploadDialog(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Trabalho
              </Button>
            )}
          </motion.div>
        )}
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
