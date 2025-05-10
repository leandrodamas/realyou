
import React, { useState, useEffect } from "react";
import FaceCaptureCamera from "./FaceCaptureCamera";
import SearchResults from "./components/SearchResults";
import FaceCaptureHeader from "./components/FaceCaptureHeader";
import { useFaceCaptureState } from "@/hooks/facial-recognition/useFaceCaptureState";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
      toast.error("Erro ao inicializar recursos de reconhecimento facial");
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

  // Mostrar tela de inicialização
  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-medium">Inicializando reconhecimento facial</h3>
        <p className="text-sm text-gray-500 mt-2">
          Preparando recursos de reconhecimento facial...
        </p>
      </div>
    );
  }

  // Mostrar tela de erro
  if (hasError) {
    return (
      <div className="flex flex-col items-center p-8 text-center">
        <div className="bg-red-50 rounded-lg p-6 max-w-md">
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-red-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Falha de inicialização</h3>
          <p className="text-gray-600 mb-4">
            Não foi possível inicializar os recursos de reconhecimento facial. Verifique sua conexão ou permissões do navegador.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Tentar novamente
          </button>
        </div>
      </div>
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
