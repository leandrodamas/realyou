
import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import FaceCaptureCamera from "./FaceCaptureCamera";
import MatchedPersonCard from "./MatchedPersonCard";
import ScheduleDialog from "./ScheduleDialog";
import SearchButton from "./SearchButton";
import NoMatchFound from "./NoMatchFound";
import { useFacialRecognition } from "@/hooks/useFacialRecognition";
import { toast } from "sonner";

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
  const [internalIsCameraActive, setInternalIsCameraActive] = useState(false);
  const [internalCapturedImage, setInternalCapturedImage] = useState<string | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [attemptingCameraAccess, setAttemptingCameraAccess] = useState(false);

  // Determine which state to use (external if provided, otherwise internal)
  const isCameraActive = externalIsCameraActive !== undefined ? externalIsCameraActive : internalIsCameraActive;
  const setIsCameraActive = setExternalIsCameraActive || setInternalIsCameraActive;
  const capturedImage = externalCapturedImage !== undefined ? externalCapturedImage : internalCapturedImage;
  const setCapturedImage = setExternalCapturedImage || setInternalCapturedImage;

  const {
    isSearching,
    matchedPerson,
    noMatchFound,
    connectionSent,
    handleSearch,
    sendConnectionRequest,
    setNoMatchFound,
    setMatchedPerson,
    resetState
  } = useFacialRecognition();

  // Reset camera state when component unmounts
  useEffect(() => {
    return () => {
      if (isCameraActive) {
        setIsCameraActive(false);
      }
      resetState();
    };
  }, []);
  
  // Reset image from localStorage when starting camera
  useEffect(() => {
    if (isCameraActive && capturedImage) {
      console.log("FaceCapture: Câmera ativada, limpando imagem anterior");
      setCapturedImage(null);
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tempCapturedImage');
      }
    }
  }, [isCameraActive]);
  
  // Check for captured image in localStorage when component mounts
  useEffect(() => {
    if (!capturedImage && !isCameraActive && typeof window !== 'undefined') {
      const tempImage = localStorage.getItem('tempCapturedImage');
      if (tempImage && setCapturedImage) {
        console.log("FaceCapture: Recuperando imagem do localStorage");
        setCapturedImage(tempImage);
        if (onCaptureImage) onCaptureImage(tempImage);
      }
    }
  }, []);

  const handleStartCamera = () => {
    console.log("FaceCapture: Botão de ativar câmera pressionado");
    // Reset any previous state
    setCapturedImage(null);
    setNoMatchFound(false);
    setAttemptingCameraAccess(true);
    
    // Set camera active immediately
    setIsCameraActive(true);
    
    toast.info("Iniciando câmera...");
    
    console.log("FaceCapture: Camera active state set to:", true);
    
    // Log device info for debugging
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    console.log("FaceCapture: Dispositivo:", isIOS ? "iOS" : isAndroid ? "Android" : "Desktop");
    
    // Request permissions immediately to avoid delay
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => console.log("FaceCapture: Permissão de câmera concedida"))
        .catch(err => console.error("FaceCapture: Erro de permissão:", err))
        .finally(() => setAttemptingCameraAccess(false));
    } else {
      console.error("FaceCapture: API mediaDevices não disponível");
      toast.error("Seu navegador não suporta acesso à câmera");
      setAttemptingCameraAccess(false);
    }
  };

  const handleCapture = () => {
    if (typeof window !== 'undefined') {
      const tempImage = localStorage.getItem('tempCapturedImage');
      if (tempImage) {
        console.log("FaceCapture: Imagem capturada com sucesso");
        setCapturedImage(tempImage);
        if (onCaptureImage) onCaptureImage(tempImage);
        
        // Limpar após uso
        localStorage.removeItem('tempCapturedImage');
      }
    }
    
    setIsCameraActive(false);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setIsCameraActive(false);
    setNoMatchFound(false);
    
    // Clear stored images
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tempCapturedImage');
    }
    
    // Force a small delay before starting camera again
    setTimeout(() => {
      handleStartCamera();
    }, 500);
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-6">
      <div className="w-full">
        {!isRegistrationMode && (
          <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Encontre conexões com fotos
            </span>
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

        {capturedImage && !matchedPerson && !noMatchFound && !isRegistrationMode && (
          <SearchButton 
            isSearching={isSearching || attemptingCameraAccess}
            onClick={() => handleSearch(capturedImage)}
          />
        )}

        {noMatchFound && (
          <NoMatchFound onReset={handleReset} />
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

      {showScheduleDialog && matchedPerson && (
        <ScheduleDialog 
          showDialog={showScheduleDialog} 
          matchedPerson={matchedPerson}
          onCloseDialog={() => setShowScheduleDialog(false)}
        />
      )}
    </div>
  );
};

export default FaceCapture;
