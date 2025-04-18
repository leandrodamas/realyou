
import React from "react";
import { Camera, Image, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";

interface CreateStorySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  storyCaption: string;
  onCaptionChange: (caption: string) => void;
}

const CreateStorySheet: React.FC<CreateStorySheetProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  storyCaption,
  onCaptionChange,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Criar nova história</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="bg-gray-100 rounded-xl aspect-[9/16] flex items-center justify-center relative overflow-hidden">
            <div className="text-center space-y-2">
              <Camera className="h-12 w-12 mx-auto text-gray-400" />
              <p className="text-gray-500 text-sm">Clique para tirar uma foto</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Camera className="mr-2 h-4 w-4" />
              Câmera
            </Button>
            <Button variant="outline" className="flex-1">
              <Image className="mr-2 h-4 w-4" />
              Galeria
            </Button>
          </div>
          
          <div className="space-y-2">
            <textarea 
              className="w-full p-3 rounded-lg border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="Escreva uma legenda..."
              value={storyCaption}
              onChange={(e) => onCaptionChange(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <SheetClose asChild>
              <Button variant="outline" className="flex-1">Cancelar</Button>
            </SheetClose>
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500"
              onClick={onSubmit}
            >
              <Send className="mr-2 h-4 w-4" />
              Publicar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateStorySheet;
