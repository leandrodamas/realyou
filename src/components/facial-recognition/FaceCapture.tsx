
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { MatchedPerson } from "./types/MatchedPersonTypes";
import FaceCaptureCamera from "./FaceCaptureCamera";
import MatchedPersonCard from "./MatchedPersonCard";
import ScheduleDialog from "./ScheduleDialog";

const FaceCapture: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [matchedPerson, setMatchedPerson] = useState<MatchedPerson | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [connectionSent, setConnectionSent] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleStartCamera = () => {
    setIsCameraActive(true);
  };

  const handleCapture = () => {
    // Get the captured image from the canvas
    if (canvasRef.current) {
      const imageDataUrl = canvasRef.current.toDataURL('image/png');
      setCapturedImage(imageDataUrl);
    } else {
      // Fallback in case canvas isn't available
      setCapturedImage("/placeholder.svg");
    }
    setIsCameraActive(false);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setIsCameraActive(false);
    setMatchedPerson(null);
    setIsSearching(false);
    setConnectionSent(false);
  };

  const handleSearch = () => {
    // Simulate searching for a face match
    setIsSearching(true);
    
    // Simulate a delay for processing
    setTimeout(() => {
      setIsSearching(false);
      setMatchedPerson({
        name: "Alex Johnson",
        profession: "Terapeuta",
        avatar: capturedImage || "/placeholder.svg", // Use the captured image or fallback
        schedule: [
          { day: "Segunda", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Terça", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Quarta", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Quinta", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Sexta", slots: ["09:00 - 12:00", "14:00 - 16:00"], active: true },
          { day: "Sábado", slots: ["10:00 - 14:00"], active: false },
          { day: "Domingo", slots: [], active: false }
        ]
      });
      toast.success("Reconhecimento facial concluído!");
    }, 2000);
  };

  const sendConnectionRequest = () => {
    setConnectionSent(true);
    toast.success("Solicitação de conexão enviada!");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full">
        <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Connect with RealYou</span>
          <Sparkles className="h-5 w-5 text-blue-500" />
        </h2>
        
        <FaceCaptureCamera
          isCameraActive={isCameraActive}
          capturedImage={capturedImage}
          onStartCamera={handleStartCamera}
          onCapture={handleCapture}
          onReset={handleReset}
        />

        <canvas ref={canvasRef} className="hidden" />

        {capturedImage && !matchedPerson && (
          <div className="mt-6 space-y-3">
            <Button 
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md" 
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Procurando...
                </div>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Encontrar Profissionais com Reconhecimento Facial
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center px-4">
              Notificaremos as pessoas se encontrarmos uma correspondência, e elas poderão escolher se conectar com você
            </p>
          </div>
        )}

        <AnimatePresence>
          {matchedPerson && (
            <MatchedPersonCard 
              matchedPerson={matchedPerson}
              connectionSent={connectionSent}
              onShowScheduleDialog={() => setShowScheduleDialog(true)}
              onSendConnectionRequest={sendConnectionRequest}
            />
          )}
        </AnimatePresence>
      </div>

      <ScheduleDialog 
        showDialog={showScheduleDialog} 
        matchedPerson={matchedPerson}
        onCloseDialog={() => setShowScheduleDialog(false)}
      />
    </div>
  );
};

export default FaceCapture;
