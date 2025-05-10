
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useCameraHandler = (
  isCameraActive?: boolean,
  setIsCameraActive?: (active: boolean) => void,
  capturedImage?: string | null,
  setCapturedImage?: (image: string | null) => void
) => {
  // Internal state for when external state is not provided
  const [internalIsCameraActive, setInternalIsCameraActive] = useState(false);
  const [internalCapturedImage, setInternalCapturedImage] = useState<string | null>(null);
  const [attemptingCameraAccess, setAttemptingCameraAccess] = useState(false);

  // Determine which state to use (external if provided, otherwise internal)
  const isActive = isCameraActive !== undefined ? isCameraActive : internalIsCameraActive;
  const setIsActive = setIsCameraActive || setInternalIsCameraActive;
  const image = capturedImage !== undefined ? capturedImage : internalCapturedImage;
  const setImage = setCapturedImage || setInternalCapturedImage;

  // Reset image from localStorage when starting camera
  useEffect(() => {
    if (isActive && image) {
      console.log("FaceCapture: Câmera ativada, limpando imagem anterior");
      setImage(null);
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tempCapturedImage');
      }
    }
  }, [isActive, image, setImage]);
  
  // Check for captured image in localStorage when component mounts
  useEffect(() => {
    if (!image && !isActive && typeof window !== 'undefined') {
      const tempImage = localStorage.getItem('tempCapturedImage');
      if (tempImage && setImage) {
        console.log("FaceCapture: Recuperando imagem do localStorage");
        setImage(tempImage);
      }
    }
  }, []);

  const handleStartCamera = () => {
    console.log("FaceCapture: Botão de ativar câmera pressionado");
    // Reset any previous state
    setImage(null);
    setAttemptingCameraAccess(true);
    
    // Set camera active immediately
    setIsActive(true);
    
    toast.info("Iniciando câmera...");
    
    console.log("FaceCapture: Camera active state set to:", true);
    
    // Log device info for debugging
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    console.log("FaceCapture: Dispositivo:", isIOS ? "iOS" : isAndroid ? "Android" : "Desktop");
    
    // Request permissions immediately to avoid delay
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => console.log("FaceCapture: Permissão de câmera concedida"))
        .catch(err => console.error("FaceCapture: Erro de permissão:", err))
        .finally(() => setAttemptingCameraAccess(false));
    } else {
      console.error("FaceCapture: API mediaDevices não disponível");
      toast.error("Seu navegador não suporta acesso à câmera");
      setAttemptingCameraAccess(false);
    }
  };

  const handleCapture = () => {
    if (typeof window !== 'undefined') {
      const tempImage = localStorage.getItem('tempCapturedImage');
      if (tempImage) {
        console.log("FaceCapture: Imagem capturada com sucesso");
        setImage(tempImage);
        
        // Limpar após uso
        localStorage.removeItem('tempCapturedImage');
      }
    }
    
    setIsActive(false);
  };

  const handleReset = () => {
    setImage(null);
    setIsActive(false);
    
    // Clear stored images
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tempCapturedImage');
    }
    
    // Force a small delay before starting camera again
    setTimeout(() => {
      handleStartCamera();
    }, 500);
  };

  return {
    isCameraActive: isActive,
    capturedImage: image,
    attemptingCameraAccess,
    handleStartCamera,
    handleCapture,
    handleReset,
    setImage,
    setIsActive
  };
};
