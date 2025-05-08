
// Interface for face detection result
export interface FaceDetectionResult {
  success: boolean;
  confidence: number;
  faceId?: string;
  userId?: string;
  error?: string;
}

// Interface for face matching result
export interface FaceMatchResult {
  success: boolean;
  matches: Array<{
    userId: string;
    name: string;
    profession: string;
    avatar: string;
    confidence: number;
    schedule?: any[];
  }>;
  error?: string;
}

// SDK Configuration Interface
export interface SDKConfig {
  apiKey: string;
  apiBaseURL?: string;
}
