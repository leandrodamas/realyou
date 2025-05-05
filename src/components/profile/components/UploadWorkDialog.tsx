
import React, { useRef, useState, useEffect } from "react";
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading, uploadProgress } = useFileUpload();

  // Check user authentication status when component loads and when dialog opens
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        // If no session found, check if there's an active user
        if (!data.session) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // We have a user but no session, refresh auth
            const { data: refreshedData } = await supabase.auth.refreshSession();
            setSession(refreshedData.session);
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    
    checkUserAuth();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setSession(session);
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [open]); // Re-check when dialog opens

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setPreviewUrl(null);
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
    
    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
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

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
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
            
            {previewUrl && (
              <div className="mb-4 relative">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-md" 
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  disabled={isUploading}
                >
                  Remover
                </Button>
              </div>
            )}
            
            <div className="space-y-2">
              {selectedFile && !previewUrl && (
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
                    Enviando... {uploadProgress > 0 ? `${uploadProgress}%` : ""}
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
          
          {session?.user ? (
            <Button 
              onClick={handleSubmit} 
              disabled={isUploading || !selectedFile || !title.trim()}
              className="w-full"
            >
              {isUploading ? "Salvando..." : "Salvar Trabalho"}
            </Button>
          ) : (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
              <p>Você precisa estar logado para adicionar trabalhos.</p>
              <p className="mt-1 text-xs">Se você já está logado e está vendo esta mensagem, tente atualizar a página.</p>
            </div>
          )}
          
          {/* Debug info - can be removed in production */}
          <div className="text-xs text-gray-400 mt-2">
            Status da sessão: {session ? "Conectado como " + session.user?.email : "Não conectado"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
