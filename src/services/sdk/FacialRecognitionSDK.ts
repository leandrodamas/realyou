
import { supabase } from "@/integrations/supabase/client";
import { FaceDetectionResult, FaceMatchResult, SDKConfig } from "./types/interfaces";
import { detectFace } from "./operations/faceDetection";
import { matchFace } from "./operations/faceMatching";
import { registerFace as registerFaceOperation } from "./operations/faceRegistration";

export class FacialRecognitionSDK {
  private apiKey: string;
  private isInitialized = false;
  private apiBaseURL = "https://api.realyou.app/v1";

  constructor(apiKey: string = "demo-key") {
    this.apiKey = apiKey;
    console.log("FacialRecognitionSDK inicializado");
  }

  public async initialize(): Promise<boolean> {
    try {
      // Validar conectividade com API
      const response = await fetch(`${this.apiBaseURL}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        this.isInitialized = true;
        console.log("SDK inicializado com sucesso");
        return true;
      } else {
        console.error("Falha na inicialização do SDK:", await response.text());
        return false;
      }
    } catch (error) {
      console.error("Erro na conectividade com API:", error);
      // Fallback para modo offline em caso de erro de conectividade
      this.isInitialized = true;
      return true;
    }
  }

  public async detectFace(imageData: string): Promise<FaceDetectionResult> {
    return detectFace(imageData, this.isInitialized, this.apiBaseURL, this.apiKey);
  }

  public async matchFace(faceId: string): Promise<FaceMatchResult> {
    return matchFace(faceId, this.isInitialized);
  }
  
  public async registerFace(imageData: string, userId: string): Promise<boolean> {
    return registerFaceOperation(imageData, userId, this.isInitialized, this.apiBaseURL, this.apiKey);
  }
}

export type { FaceDetectionResult, FaceMatchResult };
