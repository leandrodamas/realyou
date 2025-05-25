
import React, { useEffect } from "react";
import FaceCaptureCamera from "./FaceCaptureCamera";
import { useKbyAiFaceCapture } from "@/hooks/facial-recognition/useKbyAiFaceCapture";
import InitializationScreen from "./components/InitializationScreen";
import FaceCaptureHeader from "./components/FaceCaptureHeader";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FaceCaptureProps {
  onCaptureComplete: (imageData: string) => void;
  isRegistrationMode?: boolean;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({
  onCaptureComplete,
  isRegistrationMode = false,
}) => {
  const {
    isLoading,
    isInitializing,
    isCameraActive,
    isDetecting,
    feedbackMessage,
    capturedImage,
    error,
    startCamera,
    stopCamera,
  } = useKbyAiFaceCapture();

  useEffect(() => {
    if (error) {
      toast.error(`Erro: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (capturedImage) {
      console.log("FaceCapture: Imagem capturada pelo hook, chamando onCaptureComplete");
      onCaptureComplete(capturedImage);
      if (isCameraActive) {
        stopCamera();
      }
    }
  }, [capturedImage, onCaptureComplete, stopCamera, isCameraActive]);

  const handleToggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleRetry = () => {
    console.log("FaceCapture: Tentando reiniciar...");
    stopCamera();
    setTimeout(() => {
      startCamera();
    }, 500);
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
        <p className="text-gray-600">{feedbackMessage || "Inicializando SDK..."}</p>
      </div>
    );
  }

  if (error && !isCameraActive) {
    return (
      <InitializationScreen
        isInitializing={false}
        hasError={true}
        error={error || "Ocorreu um erro desconhecido."}
        onRetry={handleRetry}
      />
    );
  }

  if (capturedImage && !isCameraActive) {
    return (
      <div className="flex flex-col items-center p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Captura Concluída</h3>
        <img src={capturedImage} alt="Rosto capturado" className="rounded-lg shadow-md mb-4 w-48 h-auto"/>
        <p className="text-green-600 mb-4">Imagem enviada para processamento.</p>
        <button
          onClick={startCamera}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Capturar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-6">
      <div className="w-full">
        <FaceCaptureHeader isRegistrationMode={isRegistrationMode} />

        <FaceCaptureCamera
          isCameraActive={isCameraActive}
          feedbackMessage={feedbackMessage}
          onToggleCamera={handleToggleCamera}
        />
      </div>
    </div>
  );
};

export default FaceCapture;
