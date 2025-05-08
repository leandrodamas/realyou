
import { useState, useEffect } from "react";
import { useFacialRecognition } from "@/hooks/useFacialRecognition";
import { toast } from "sonner";

export const useFaceCaptureState = ({
  onCaptureImage,
  capturedImage: externalCapturedImage,
  setCapturedImage: setExternalCapturedImage,
  isCameraActive: externalIsCameraActive,
  setIsCameraActive: setExternalIsCameraActive,
}) => {
  // Internal state for when external state is not provided
  const [internalIsCameraActive, setInternalIsCameraActive] = useState(false);
  const [internalCapturedImage, setInternalCapturedImage] = useState<string | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [attemptingCameraAccess, setAttemptingCameraAccess] = useState(false);

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

  // Reset camera state when component unmounts
  useEffect(() => {
    return () => {
      if (isCameraActive) {
        setIsCameraActive(false);
      }
      resetState();
    };
  }, []);
  
  // Reset image from localStorage when starting camera
  useEffect(() => {
    if (isCameraActive && capturedImage) {
      console.log("FaceCapture: Câmera ativada, limpando imagem anterior");
      setCapturedImage(null);
      
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('tempCapturedImage');
      }
    }
  }, [isCameraActive]);
  
  // Check for captured image in localStorage when component mounts
  useEffect(() => {
    if (!capturedImage && !isCameraActive && typeof window !== 'undefined') {
      const tempImage = localStorage.getItem('tempCapturedImage');
      if (tempImage && setCapturedImage) {
        console.log("FaceCapture: Recuperando imagem do localStorage");
        setCapturedImage(tempImage);
        if (onCaptureImage) onCaptureImage(tempImage);
      }
    }
  }, []);

  const handleStartCamera = () => {
    console.log("FaceCapture: Botão de ativar câmera pressionado");
    // Reset any previous state
    setCapturedImage(null);
    setNoMatchFound(false);
    setAttemptingCameraAccess(true);
    
    // Set camera active immediately
    setIsCameraActive(true);
    
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
        setCapturedImage(tempImage);
        if (onCaptureImage) onCaptureImage(tempImage);
        
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
    
    // Force a small delay before starting camera again
    setTimeout(() => {
      handleStartCamera();
    }, 500);
  };

  return {
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
  };
};
