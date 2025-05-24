
import { toast } from "sonner";
import { FacialRecognitionSDK } from "./FacialRecognitionSDK";

let sdkInstance: FacialRecognitionSDK | null = null;

export const getFacialRecognitionSDK = async (): Promise<FacialRecognitionSDK> => {
  if (!sdkInstance) {
    // Obter a chave de API de variáveis de ambiente ou configuração
    const apiKey = import.meta.env.VITE_FACIAL_RECOGNITION_API_KEY || "kbyai-integration";
    
    sdkInstance = new FacialRecognitionSDK(apiKey);
    
    try {
      const initialized = await sdkInstance.initialize();
      if (!initialized) {
        throw new Error("SDK initialization failed");
      }
      console.log("SDK inicializado com sucesso");
    } catch (error) {
      console.error("Failed to initialize Facial Recognition SDK:", error);
      toast.error("Falha ao inicializar o reconhecimento facial");
      throw error;
    }
  }
  
  return sdkInstance;
};
