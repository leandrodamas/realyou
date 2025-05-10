
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

  // Ensure we log state changes
  useEffect(() => {
    console.log("useCameraHandler: Camera active state changed:", isActive);
  }, [isActive]);

  useEffect(() => {
    console.log("useCameraHandler: Image state changed:", image ? "Image exists" : "No image");
  }, [image]);

  // Reset image from localStorage when starting camera
  useEffect(() => {
    if (isActive && image) {
      console.log("useCameraHandler: Camera activated, clearing previous image");
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
        console.log("useCameraHandler: Retrieving image from localStorage");
        setImage(tempImage);
      }
    }
  }, []);

  const handleStartCamera = () => {
    console.log("useCameraHandler: Start camera called");
    // Reset any previous state
    setImage(null);
    setAttemptingCameraAccess(true);
    
    // Set camera active immediately
    setIsActive(true);
    
    console.log("useCameraHandler: Camera active state set to:", true);
    
    // Log device info for debugging
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    console.log("useCameraHandler: Device:", isIOS ? "iOS" : isAndroid ? "Android" : "Desktop");
    
    // Request permissions immediately to avoid delay
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          console.log("useCameraHandler: Camera permission granted");
          toast.success("Permissão de câmera concedida");
        })
        .catch(err => {
          console.error("useCameraHandler: Camera permission error:", err);
          toast.error("Erro na permissão da câmera: " + (err.message || "Acesso negado"));
          // If there's an error, we should reset the camera active state
          setIsActive(false);
        })
        .finally(() => setAttemptingCameraAccess(false));
    } else {
      console.error("useCameraHandler: mediaDevices API not available");
      toast.error("Seu navegador não suporta acesso à câmera");
      setAttemptingCameraAccess(false);
      setIsActive(false);
    }
  };

  const handleCapture = () => {
    console.log("useCameraHandler: Capture called");
    
    if (typeof window !== 'undefined') {
      const tempImage = localStorage.getItem('tempCapturedImage');
      if (tempImage) {
        console.log("useCameraHandler: Image captured successfully from localStorage");
        setImage(tempImage);
        
        // Clear after use
        localStorage.removeItem('tempCapturedImage');
      } else {
        console.warn("useCameraHandler: No image found in localStorage");
        toast.error("Não foi possível capturar a imagem");
      }
    }
    
    setIsActive(false);
  };

  const handleReset = () => {
    console.log("useCameraHandler: Reset called");
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
