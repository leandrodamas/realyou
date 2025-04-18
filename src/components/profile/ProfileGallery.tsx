
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Share2, Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WorkItem {
  id: string;
  image_path: string;
  title: string | null;
  description: string | null;
  likes: number;
  comments: number;
}

const ProfileGallery: React.FC = () => {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get the current authenticated user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();
    loadWorkGallery();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast.error("Você precisa estar logado para adicionar trabalhos");
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('work_gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('work_gallery')
        .getPublicUrl(filePath);

      // Save metadata to database with user_id
      const { error: dbError } = await supabase
        .from('work_gallery')
        .insert({
          image_path: publicUrl,
          title,
          description,
          user_id: user.id // Add the user ID here
        });

      if (dbError) throw dbError;

      toast.success("Trabalho adicionado com sucesso!");
      setShowUploadDialog(false);
      loadWorkGallery(); // Reload gallery
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
      setTitle("");
      setDescription("");
    }
  };

  const loadWorkGallery = async () => {
    try {
      const { data, error } = await supabase
        .from('work_gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading work gallery:', error);
      toast.error("Erro ao carregar galeria");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
        {items.map((post) => (
          <motion.div 
            key={post.id}
            variants={item}
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
          >
            <div className="relative aspect-square bg-gray-100">
              <img
                src={post.image_path}
                alt={post.title || "Trabalho"}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-3">
              {post.title && (
                <h3 className="font-medium mb-1">{post.title}</h3>
              )}
              {post.description && (
                <p className="text-sm text-gray-500 mb-2">{post.description}</p>
              )}
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Trabalho</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <Input
                placeholder="Nome do trabalho"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <Textarea
                placeholder="Descreva seu trabalho"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Enviando..." : "Selecionar Imagem"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileGallery;
