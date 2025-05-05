
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useFileUpload } from "@/hooks/useFileUpload";

export const useWorkSubmit = (
  onUploadSuccess: () => void,
  onOpenChange: (open: boolean) => void,
  resetForm: () => void
) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { uploadFile, isUploading, uploadProgress } = useFileUpload();

  const handleSubmit = async (selectedFile: File | null, session: any) => {
    if (!selectedFile) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    if (!title.trim()) {
      toast.error("Por favor, adicione um título");
      return;
    }
    
    // Check if user is logged in
    if (!session?.user) {
      console.error("No user session found", session);
      toast.error("Você precisa estar logado para adicionar trabalhos");
      return;
    }

    try {
      const currentUser = session.user;
      console.log("Uploading with user:", currentUser.id);

      // Upload image to work_gallery bucket
      const { publicUrl, error: uploadError } = await uploadFile(selectedFile, {
        bucketName: 'work_gallery',
        folder: currentUser.id,
        metadata: {
          user_id: currentUser.id,
          title: title.trim()
        }
      });

      if (uploadError || !publicUrl) {
        toast.error("Erro ao fazer upload da imagem");
        return;
      }

      // Save work details to database
      const { error: dbError } = await supabase
        .from('work_gallery')
        .insert({
          image_path: publicUrl,
          title: title.trim(),
          description: description.trim(),
          user_id: currentUser.id
        });

      if (dbError) throw dbError;

      toast.success("Trabalho adicionado com sucesso!");
      onUploadSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error saving work:', error);
      toast.error("Erro ao salvar o trabalho");
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    isUploading,
    uploadProgress,
    handleSubmit
  };
};
