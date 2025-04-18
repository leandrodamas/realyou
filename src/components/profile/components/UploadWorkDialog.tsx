
import React, { useRef, useState } from "react";
import { Upload, Loader2, ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UploadDialogProps } from "../types/gallery";
import { useFileUpload } from "@/hooks/useFileUpload";

export const UploadWorkDialog: React.FC<UploadDialogProps> = ({ 
  open, 
  onOpenChange,
  onUploadSuccess 
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useFileUpload();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("O arquivo deve ter menos de 5MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    if (!title.trim()) {
      toast.error("Por favor, adicione um título");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para adicionar trabalhos");
        return;
      }

      const { publicUrl, error: uploadError } = await uploadFile(selectedFile, {
        bucketName: 'work_gallery'
      });

      if (uploadError || !publicUrl) {
        toast.error("Erro ao fazer upload da imagem");
        return;
      }

      const { error: dbError } = await supabase
        .from('work_gallery')
        .insert({
          image_path: publicUrl,
          title: title.trim(),
          description: description.trim(),
          user_id: user.id
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

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Trabalho</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título *</label>
            <Input
              placeholder="Nome do trabalho"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <Textarea
              placeholder="Descreva seu trabalho"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
            />
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <div className="space-y-2">
              {selectedFile && (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>{selectedFile.name}</span>
                </div>
              )}
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {selectedFile ? "Trocar Imagem" : "Selecionar Imagem"}
                  </>
                )}
              </Button>
            </div>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isUploading || !selectedFile || !title.trim()}
            className="w-full"
          >
            {isUploading ? "Salvando..." : "Salvar Trabalho"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
