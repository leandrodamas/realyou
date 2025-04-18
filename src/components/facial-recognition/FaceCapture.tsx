
import React, { useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import FaceCaptureCamera from "./FaceCaptureCamera";
import MatchedPersonCard from "./MatchedPersonCard";
import ScheduleDialog from "./ScheduleDialog";
import SearchButton from "./SearchButton";
import NoMatchFound from "./NoMatchFound";
import { useFacialRecognition } from "@/hooks/useFacialRecognition";

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
  const [internalIsCameraActive, setInternalIsCameraActive] = React.useState(false);
  const [internalCapturedImage, setInternalCapturedImage] = React.useState<string | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = React.useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHeavyDevice, setIsHeavyDevice] = React.useState(false);

  // Determinar se o dispositivo é um dispositivo móvel de baixo desempenho
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);
    const isOldAndroid = /Android 4.|Android 5.|Android 6./i.test(userAgent);
    const isLowPerformanceIOS = /iPhone OS 9_|iPhone OS 10_|iPhone OS 11_/i.test(userAgent) && 
                               !/iPhone X|iPhone 8|iPhone 11|iPhone 12|iPhone 13|iPhone 14/i.test(userAgent);
    
    setIsHeavyDevice(isMobile && (isOldAndroid || isLowPerformanceIOS));
  }, []);

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

  // Garantir limpeza correta quando componente é desmontado
  useEffect(() => {
    return () => {
      if (isCameraActive) {
        setIsCameraActive(false);
      }
      resetState();
    };
  }, []);

  const handleStartCamera = () => {
    setIsCameraActive(true);
    setNoMatchFound(false);
  };

  const handleCapture = () => {
    if (canvasRef.current) {
      try {
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg', 0.85);
        setCapturedImage(imageDataUrl);
        if (onCaptureImage) onCaptureImage(imageDataUrl);
      } catch (error) {
        console.error("Erro ao processar captura:", error);
      }
    }
    setIsCameraActive(false);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setIsCameraActive(false);
    setNoMatchFound(false);
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-6">
      <div className="w-full">
        {!isRegistrationMode && !isHeavyDevice && (
          <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Connect with RealYou
            </span>
            <Sparkles className="h-5 w-5 text-blue-500" />
          </h2>
        )}
        
        {!isRegistrationMode && isHeavyDevice && (
          <h2 className="text-lg font-bold text-center mb-2">
            Connect with RealYou
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
          <SearchButton 
            isSearching={isSearching}
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

      {/* Só renderizar o diálogo de agenda quando necessário */}
      {showScheduleDialog && (
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
