
import React, { useState } from "react";
import { 
  Sheet, SheetContent, SheetHeader, 
  SheetTitle, SheetDescription, SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PencilLine } from "lucide-react";

interface ProfileEditSheetProps {
  name: string;
  title: string;
  onSave: (name: string, title: string, bio: string) => void;
}

const ProfileEditSheet: React.FC<ProfileEditSheetProps> = ({
  name,
  title,
  onSave
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedBio, setEditedBio] = useState("");

  const handleSave = () => {
    onSave(editedName, editedTitle, editedBio);
    setIsOpen(false);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full border-purple-200"
        >
          <PencilLine className="h-4 w-4 mr-1" />
          Editar perfil
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Editar Perfil</SheetTitle>
          <SheetDescription>
            Atualize suas informações de perfil aqui. Clique em salvar quando terminar.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input 
              id="name" 
              value={editedName} 
              onChange={(e) => setEditedName(e.target.value)} 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Título Profissional</Label>
            <Input 
              id="title" 
              value={editedTitle} 
              onChange={(e) => setEditedTitle(e.target.value)} 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              value={editedBio} 
              onChange={(e) => setEditedBio(e.target.value)} 
              placeholder="Escreva sobre você e seu trabalho"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileEditSheet;
