
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, UserPlus, X, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FaceCapture: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleStartCamera = () => {
    setIsDialogOpen(true);
    setIsCameraActive(true);
  };

  const handleCapture = () => {
    // Simular captura de imagem
    setCapturedImage("/placeholder.svg");
    setIsCameraActive(false);
    toast({
      title: "Imagem capturada com sucesso!",
      description: "Sua foto foi registrada para reconhecimento facial.",
    });
  };

  const handleReset = () => {
    setCapturedImage(null);
    setIsCameraActive(false);
  };

  const handleSearch = () => {
    // Em uma implementação real, isso enviaria a imagem para correspondência de reconhecimento facial
    console.log("Searching for face matches...");
    toast({
      title: "Buscando correspondências...",
      description: "Procurando pessoas com reconhecimento facial.",
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsCameraActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Connect with RealYou
          <Sparkles className="h-5 w-5 text-purple-500" />
        </h2>
        
        <div className="bg-gray-100 rounded-lg aspect-square w-full relative overflow-hidden">
          {capturedImage ? (
            <div className="relative w-full h-full">
              <img 
                src={capturedImage} 
                alt="Captured face" 
                className="w-full h-full object-cover"
              />
              <Button 
                variant="destructive" 
                size="icon"
                className="absolute top-2 right-2 rounded-full"
                onClick={handleReset}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 mb-4">Tire uma foto para se conectar</p>
              <Button onClick={handleStartCamera} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                Iniciar Câmera
              </Button>
            </div>
          )}
        </div>

        {capturedImage && (
          <div className="mt-4 space-y-2">
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 flex items-center justify-center gap-2" 
              onClick={handleSearch}
            >
              <UserPlus className="h-4 w-4" />
              Encontrar Profissionais com Reconhecimento Facial
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Notificaremos as pessoas se encontrarmos uma correspondência, e elas poderão escolher se conectar com você
            </p>
          </div>
        )}
      </div>

      {/* Dialog para câmera */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Capturar Foto</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black relative flex items-center justify-center">
            {isCameraActive && (
              <>
                <div className="text-white">Visualização da Câmera</div>
                <div className="absolute bottom-4 w-full flex justify-center">
                  <Button onClick={handleCapture} className="rounded-full bg-white text-black">
                    <Camera className="h-6 w-6" />
                  </Button>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FaceCapture;
