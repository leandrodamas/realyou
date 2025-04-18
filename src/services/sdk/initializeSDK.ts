
import { toast } from "sonner";
import { FacialRecognitionSDK } from "./FacialRecognitionSDK";

let sdkInstance: FacialRecognitionSDK | null = null;

export const getFacialRecognitionSDK = async (): Promise<FacialRecognitionSDK> => {
  if (!sdkInstance) {
    sdkInstance = new FacialRecognitionSDK(process.env.FACIAL_SDK_API_KEY);
    
    try {
      const initialized = await sdkInstance.initialize();
      if (!initialized) {
        throw new Error("SDK initialization failed");
      }
    } catch (error) {
      console.error("Failed to initialize Facial Recognition SDK:", error);
      toast.error("Falha ao inicializar o reconhecimento facial");
      throw error;
    }
  }
  
  return sdkInstance;
};
