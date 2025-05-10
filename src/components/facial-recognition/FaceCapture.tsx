
import React, { useState, useEffect } from "react";
import FaceCaptureCamera from "./FaceCaptureCamera";
import { useFaceCaptureState } from "@/hooks/facial-recognition";
import InitializationScreen from "./components/InitializationScreen";
import SearchResults from "./components/SearchResults";
import FaceCaptureHeader from "./components/FaceCaptureHeader";
import type { FaceCaptureProps } from "@/hooks/facial-recognition";

const FaceCapture: React.FC<FaceCaptureProps> = ({
  onCaptureImage,
  capturedImage: externalCapturedImage,
  setCapturedImage: setExternalCapturedImage,
  isCameraActive: externalIsCameraActive,
  setIsCameraActive: setExternalIsCameraActive,
  isRegistrationMode = false,
}) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simulando inicialização dos recursos de reconhecimento facial
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Adicionar tratamento de erros
  useEffect(() => {
    const handleError = (error: any) => {
      console.error("Erro na inicialização do reconhecimento facial:", error);
      setHasError(true);
    };
    
    window.addEventListener('facialRecognitionError', handleError);
    
    return () => {
      window.removeEventListener('facialRecognitionError', handleError);
    };
  }, []);

  const {
    isCameraActive,
    capturedImage,
    isSearching,
    matchedPerson,
    noMatchFound,
    connectionSent,
    showScheduleDialog,
    attemptingCameraAccess,
    handleStartCamera,
    handleCapture,
    handleReset,
    handleSearch,
    sendConnectionRequest,
    setShowScheduleDialog,
    setNoMatchFound
  } = useFaceCaptureState({
    onCaptureImage,
    capturedImage: externalCapturedImage,
    setCapturedImage: setExternalCapturedImage,
    isCameraActive: externalIsCameraActive,
    setIsCameraActive: setExternalIsCameraActive,
  });

  // Retry function for error state
  const handleRetry = () => window.location.reload();

  // Render initialization or error screen when needed
  if (isInitializing || hasError) {
    return (
      <InitializationScreen 
        isInitializing={isInitializing} 
        hasError={hasError} 
        onRetry={handleRetry} 
      />
    );
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-6">
      <div className="w-full">
        <FaceCaptureHeader isRegistrationMode={isRegistrationMode} />
        
        <FaceCaptureCamera
          isCameraActive={isCameraActive}
          capturedImage={capturedImage}
          onStartCamera={handleStartCamera}
          onCapture={handleCapture}
          onReset={handleReset}
        />

        <SearchResults 
          capturedImage={capturedImage}
          matchedPerson={matchedPerson}
          noMatchFound={noMatchFound}
          connectionSent={connectionSent}
          isSearching={isSearching}
          isRegistrationMode={isRegistrationMode}
          attemptingCameraAccess={attemptingCameraAccess}
          showScheduleDialog={showScheduleDialog}
          onReset={handleReset}
          onSearch={handleSearch}
          onSendConnectionRequest={sendConnectionRequest}
          onShowScheduleDialog={setShowScheduleDialog}
        />
      </div>
    </div>
  );
};

export default FaceCapture;
