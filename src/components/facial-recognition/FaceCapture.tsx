import React, { useEffect } from "react";
import FaceCaptureCamera from "./FaceCaptureCamera"; // Manter ou adaptar?
import { useKbyAiFaceCapture } from "@/hooks/facial-recognition/useKbyAiFaceCapture"; // Importar o novo hook
import InitializationScreen from "./components/InitializationScreen";
import SearchResults from "./components/SearchResults"; // Manter ou adaptar?
import FaceCaptureHeader from "./components/FaceCaptureHeader";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Props podem precisar de ajuste dependendo do que o componente pai precisa
interface FaceCaptureProps {
  onCaptureComplete: (imageData: string) => void; // Callback quando a captura for bem-sucedida
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

  // Efeito para lidar com erros
  useEffect(() => {
    if (error) {
      toast.error(`Erro: ${error}`);
      // Poderia tentar reiniciar ou oferecer opção de retry
    }
  }, [error]);

  // Efeito para chamar o callback quando a imagem for capturada
  useEffect(() => {
    if (capturedImage) {
      console.log("FaceCapture: Imagem capturada pelo hook, chamando onCaptureComplete");
      onCaptureComplete(capturedImage);
      // O hook já para a câmera, mas podemos garantir
      if (isCameraActive) {
        stopCamera();
      }
    }
  }, [capturedImage, onCaptureComplete, stopCamera, isCameraActive]);

  // Lida com o clique no botão de iniciar/parar câmera
  const handleToggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Lida com a tentativa de reiniciar (caso haja erro)
  const handleRetry = () => {
    console.log("FaceCapture: Tentando reiniciar...");
    // Idealmente, o hook teria uma função de retry, mas podemos tentar reiniciar a câmera
    stopCamera();
    setTimeout(() => {
      startCamera();
    }, 500);
  };

  // Renderização condicional baseada no estado
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
        errorMessage={error || "Ocorreu um erro desconhecido."}
        onRetry={handleRetry}
      />
    );
  }

  // TODO: Adaptar SearchResults ou criar nova lógica para o que fazer após a captura
  // O SDK KBY-AI foca na *captura* de alta qualidade. O reconhecimento/busca
  // provavelmente ocorrerá em outra etapa, enviando `capturedImage` para o backend.
  if (capturedImage && !isCameraActive) {
     return (
      <div className="flex flex-col items-center p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Captura Concluída</h3>
        <img src={capturedImage} alt="Rosto capturado" className="rounded-lg shadow-md mb-4 w-48 h-auto"/>
        <p className="text-green-600 mb-4">Imagem enviada para processamento.</p>
        {/* Adicionar botão para nova captura ou voltar? */}
         <button
            onClick={startCamera} // Reinicia o processo
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

        {/* Passar o estado e feedback do novo hook para FaceCaptureCamera */}
        <FaceCaptureCamera
          isCameraActive={isCameraActive}
          isLoading={isLoading} // Adicionar estado de loading
          feedbackMessage={feedbackMessage} // Mensagem de feedback do SDK
          onToggleCamera={handleToggleCamera} // Usar a função de toggle
          // Remover props antigas como onCapture, onReset se não forem mais necessárias
          // ou adaptar FaceCaptureCamera para usá-las com o novo hook
        />

        {/* A seção de resultados pode precisar ser repensada */}
        {/* O SDK KBY-AI Web foca na captura, não no reconhecimento direto */}
        {/* <SearchResults
          capturedImage={capturedImage}
          // ... outras props adaptadas ou removidas
        /> */}
      </div>
    </div>
  );
};

export default FaceCapture;

