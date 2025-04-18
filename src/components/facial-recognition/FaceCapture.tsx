
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { MatchedPerson } from "./types/MatchedPersonTypes";
import FaceCaptureCamera from "./FaceCaptureCamera";
import MatchedPersonCard from "./MatchedPersonCard";
import ScheduleDialog from "./ScheduleDialog";
import { detectAndMatchFace } from "@/services/facialRecognitionService";

interface FaceCaptureProps {
  onCaptureImage?: (imageData: string) => void;
  capturedImage?: string | null;
  setCapturedImage?: (image: string | null) => void;
  isCameraActive?: boolean;
  setIsCameraActive?: (active: boolean) => void;
  isRegistrationMode?: boolean;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({
  onCaptureImage,
  capturedImage: externalCapturedImage,
  setCapturedImage: setExternalCapturedImage,
  isCameraActive: externalIsCameraActive,
  setIsCameraActive: setExternalIsCameraActive,
  isRegistrationMode = false,
}) => {
  // Use local or external state based on what's provided
  const [internalIsCameraActive, setInternalIsCameraActive] = useState(false);
  const [internalCapturedImage, setInternalCapturedImage] = useState<string | null>(null);
  
  // Determine which state to use (external if provided, otherwise internal)
  const isCameraActive = externalIsCameraActive !== undefined ? externalIsCameraActive : internalIsCameraActive;
  const setIsCameraActive = setExternalIsCameraActive || setInternalIsCameraActive;
  const capturedImage = externalCapturedImage !== undefined ? externalCapturedImage : internalCapturedImage;
  const setCapturedImage = setExternalCapturedImage || setInternalCapturedImage;

  const [isSearching, setIsSearching] = useState(false);
  const [matchedPerson, setMatchedPerson] = useState<MatchedPerson | null>(null);
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [connectionSent, setConnectionSent] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleStartCamera = () => {
    setIsCameraActive(true);
    setNoMatchFound(false);
  };

  const handleCapture = () => {
    // Get the captured image from the canvas
    if (canvasRef.current) {
      const imageDataUrl = canvasRef.current.toDataURL('image/png');
      setCapturedImage(imageDataUrl);
      
      // If we have an external handler, call it
      if (onCaptureImage) {
        onCaptureImage(imageDataUrl);
      }
    } else {
      // Fallback in case canvas isn't available
      const fallbackImage = "/placeholder.svg";
      setCapturedImage(fallbackImage);
      
      if (onCaptureImage) {
        onCaptureImage(fallbackImage);
      }
    }
    setIsCameraActive(false);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setIsCameraActive(false);
    setMatchedPerson(null);
    setIsSearching(false);
    setConnectionSent(false);
    setNoMatchFound(false);
  };

  const handleSearch = async () => {
    // Guard against no image
    if (!capturedImage) {
      toast.error("Nenhuma imagem capturada para análise");
      return;
    }
    
    // Start the search process
    setIsSearching(true);
    setNoMatchFound(false);
    
    try {
      // Use the facial recognition service to detect and match faces
      const matchResult = await detectAndMatchFace(capturedImage);
      
      // Handle results
      if (matchResult && matchResult.success) {
        if (matchResult.matches.length > 0) {
          const bestMatch = matchResult.matches[0];
          setMatchedPerson({
            name: bestMatch.name,
            profession: bestMatch.profession,
            avatar: bestMatch.avatar,
            schedule: bestMatch.schedule || []
          });
          toast.success("Reconhecimento facial concluído!");
        } else {
          setNoMatchFound(true);
          toast.info("Nenhuma correspondência encontrada");
        }
      } else {
        toast.error("Falha no reconhecimento facial. Tente novamente.");
        setNoMatchFound(true);
      }
    } catch (error) {
      console.error("Error during face recognition:", error);
      toast.error("Ocorreu um erro durante o reconhecimento facial");
      setNoMatchFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const sendConnectionRequest = () => {
    setConnectionSent(true);
    toast.success("Solicitação de conexão enviada!");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full">
        {!isRegistrationMode && (
          <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Connect with RealYou</span>
            <Sparkles className="h-5 w-5 text-blue-500" />
          </h2>
        )}
        
        <FaceCaptureCamera
          isCameraActive={isCameraActive}
          capturedImage={capturedImage}
          onStartCamera={handleStartCamera}
          onCapture={handleCapture}
          onReset={handleReset}
        />

        <canvas ref={canvasRef} className="hidden" />

        {capturedImage && !matchedPerson && !noMatchFound && !isRegistrationMode && (
          <div className="mt-6 space-y-3">
            <Button 
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md" 
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Procurando...
                </div>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Encontrar Profissionais com Reconhecimento Facial
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center px-4">
              Notificaremos as pessoas se encontrarmos uma correspondência, e elas poderão escolher se conectar com você
            </p>
          </div>
        )}

        {noMatchFound && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <h3 className="font-medium">Nenhuma correspondência encontrada</h3>
            </div>
            <p className="text-sm text-orange-600 mt-2">
              Não encontramos ninguém com esse rosto em nossa base de dados.
              Tente novamente com iluminação melhor ou ângulo diferente.
            </p>
            <Button 
              variant="outline" 
              className="mt-3 w-full border-orange-300 text-orange-700 hover:bg-orange-100"
              onClick={handleReset}
            >
              Tentar Novamente
            </Button>
          </motion.div>
        )}

        <AnimatePresence>
          {matchedPerson && (
            <MatchedPersonCard 
              matchedPerson={matchedPerson}
              connectionSent={connectionSent}
              onShowScheduleDialog={() => setShowScheduleDialog(true)}
              onSendConnectionRequest={sendConnectionRequest}
            />
          )}
        </AnimatePresence>
      </div>

      <ScheduleDialog 
        showDialog={showScheduleDialog} 
        matchedPerson={matchedPerson}
        onCloseDialog={() => setShowScheduleDialog(false)}
      />
    </div>
  );
};

export default FaceCapture;
