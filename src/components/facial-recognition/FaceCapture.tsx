
import React, { useState, useEffect } from "react";
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
  const [internalIsCameraActive, setInternalIsCameraActive] = useState(false);
  const [internalCapturedImage, setInternalCapturedImage] = useState<string | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

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

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (isCameraActive) {
        setIsCameraActive(false);
      }
      resetState();
    };
  }, []);
  
  // Check for captured image in localStorage when component mounts
  useEffect(() => {
    if (!capturedImage && typeof window !== 'undefined') {
      const tempImage = localStorage.getItem('tempCapturedImage');
      if (tempImage && setCapturedImage) {
        console.log("Recuperando imagem do localStorage");
        setCapturedImage(tempImage);
        if (onCaptureImage) onCaptureImage(tempImage);
      }
    }
    
    // Check for user profile
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile && !capturedImage) {
      try {
        const profile = JSON.parse(userProfile);
        if (profile.profileImage && setCapturedImage) {
          console.log("Usando imagem de perfil como imagem capturada");
          setCapturedImage(profile.profileImage);
          if (onCaptureImage) onCaptureImage(profile.profileImage);
        }
      } catch (error) {
        console.error("Erro ao processar perfil do usuário:", error);
      }
    }
  }, []);

  const handleStartCamera = () => {
    setIsCameraActive(true);
    setNoMatchFound(false);
  };

  const handleCapture = () => {
    if (typeof window !== 'undefined') {
      const tempImage = localStorage.getItem('tempCapturedImage');
      if (tempImage) {
        setCapturedImage(tempImage);
        if (onCaptureImage) onCaptureImage(tempImage);
        
        // Salvar no perfil do usuário também
        try {
          const userProfile = localStorage.getItem('userProfile');
          const profile = userProfile ? JSON.parse(userProfile) : {};
          
          const updatedProfile = {
            ...profile,
            profileImage: tempImage,
            lastUpdated: new Date().toISOString()
          };
          
          localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        } catch (error) {
          console.error("Erro ao atualizar perfil com nova imagem:", error);
        }
        
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
