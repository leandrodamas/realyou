
import React, { useState, useEffect } from "react";
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

  // Log component rendering for debugging
  useEffect(() => {
    console.log("FaceCapture component rendered");
  }, []);

  const handleStartCamera = () => {
    setIsDialogOpen(true);
    setIsCameraActive(true);
    console.log("Camera started");
  };

  const handleCapture = () => {
    // Simular captura de imagem com um placeholder
    const placeholderImage = "/placeholder.svg";
    setCapturedImage(placeholderImage);
    setIsCameraActive(false);
    setIsDialogOpen(false);
    toast({
      title: "Imagem capturada com sucesso!",
      description: "Sua foto foi registrada para reconhecimento facial.",
    });
    console.log("Image captured");
  };

  const handleReset = () => {
    setCapturedImage(null);
    setIsCameraActive(false);
    console.log("Image reset");
  };

  const handleSearch = () => {
    console.log("Searching for facial matches...");
    toast({
      title: "Buscando correspondências...",
      description: "Procurando pessoas com reconhecimento facial.",
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsCameraActive(false);
    console.log("Dialog closed");
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Connect with RealYou
          <Sparkles className="h-5 w-5 text-purple-500" />
        </h2>
        
        <div className="bg-gray-100 rounded-lg aspect-square w-full relative overflow-hidden shadow-md">
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
            <div className="flex flex-col items-center justify-center h-full p-4">
              <div className="mb-6">
                <Camera className="h-16 w-16 text-purple-300 mb-2" />
              </div>
              <p className="text-gray-500 mb-4 text-center">Tire uma foto para se conectar com outros profissionais</p>
              <Button 
                onClick={handleStartCamera} 
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-md"
              >
                Iniciar Câmera
              </Button>
            </div>
          )}
        </div>

        {capturedImage && (
          <div className="mt-6 space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 flex items-center justify-center gap-2 shadow-md py-6" 
              onClick={handleSearch}
            >
              <UserPlus className="h-5 w-5" />
              Encontrar Profissionais com Reconhecimento Facial
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Notificaremos as pessoas se encontrarmos uma correspondência, e elas poderão escolher se conectar com você
            </p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Capturar Foto</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black relative flex items-center justify-center rounded-md">
            {isCameraActive && (
              <>
                <div className="text-white">Visualização da Câmera</div>
                <div className="absolute bottom-4 w-full flex justify-center">
                  <Button 
                    onClick={handleCapture} 
                    className="rounded-full bg-white text-black hover:bg-gray-100"
                    size="lg"
                  >
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
