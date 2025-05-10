
import React, { useState } from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CameraButton: React.FC = () => {
  const navigate = useNavigate();
  const [isActivating, setIsActivating] = useState(false);
  
  const handleCameraClick = async () => {
    try {
      setIsActivating(true);
      
      // Mobile device detection
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      console.log("Requesting camera access...");
      console.log("Device is mobile:", isMobile);
      
      toast.info("Acessando câmera...");
      
      // Check if we can enumerate devices (this helps detect permissions issues early)
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log(`Found ${videoDevices.length} video devices:`, videoDevices.map(d => d.label || 'unnamed device'));
        
        // No cameras detected case
        if (videoDevices.length === 0) {
          toast.error("Nenhuma câmera detectada no dispositivo");
          setIsActivating(false);
          return;
        }
      } catch (enumErr) {
        console.warn("Could not enumerate devices:", enumErr);
        // Continue anyway as we might still be able to access the camera
      }
      
      // First, try environment camera (rear camera) with exact constraint
      try {
        console.log("Trying to access environment camera with exact constraint");
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: { exact: "environment" } },
          audio: false 
        });
        
        // If we get here, we successfully got the rear camera
        console.log("Successfully accessed rear-facing camera");
        stopStreamTracks(stream); // Clean up the test stream
        navigate("/facial-recognition");
        return;
      } catch (exactEnvError) {
        console.log("Couldn't access exact environment camera:", exactEnvError);
        
        // Second, try environment camera as preference (not exact)
        try {
          console.log("Trying to access environment camera as preference");
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" },
            audio: false 
          });
          
          console.log("Successfully accessed camera with environment preference");
          stopStreamTracks(stream); // Clean up the test stream
          navigate("/facial-recognition");
          return;
        } catch (envError) {
          console.log("Couldn't access environment camera as preference:", envError);
          
          // Third, try any camera
          try {
            console.log("Trying to access any camera");
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: true,
              audio: false 
            });
            
            console.log("Successfully accessed a camera");
            stopStreamTracks(stream); // Clean up the test stream
            
            // If on mobile, warn user that we might be using front camera
            if (isMobile) {
              toast.info("Câmera frontal detectada. Para melhores resultados, use a câmera traseira se disponível.");
            }
            
            navigate("/facial-recognition");
            return;
          } catch (anyError) {
            console.error("Couldn't access any camera:", anyError);
            toast.error("Não foi possível acessar nenhuma câmera do dispositivo");
            throw new Error("Camera access failed");
          }
        }
      }
      
    } catch (error) {
      console.error("Erro ao acessar câmera:", error);
      toast.error("Não foi possível acessar a câmera. Verifique suas permissões.");
    } finally {
      setIsActivating(false);
    }
  };
  
  // Helper function to clean up camera streams
  const stopStreamTracks = (stream: MediaStream) => {
    stream.getTracks().forEach(track => {
      track.stop();
    });
  };

  return (
    <motion.div 
      className="fixed bottom-24 right-6 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <button 
        className={`rounded-full flex items-center justify-center ${
          isActivating ? "bg-gray-500" : "bg-gradient-to-r from-purple-600 to-blue-500"
        } p-3.5 shadow-lg border-4 border-white`}
        onClick={handleCameraClick}
        aria-label="Reconhecimento Facial"
        disabled={isActivating}
      >
        {isActivating ? (
          <div className="h-8 w-8 flex items-center justify-center">
            <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
          </div>
        ) : (
          <Camera className="h-8 w-8 text-white" />
        )}
      </button>
    </motion.div>
  );
};

export default CameraButton;
