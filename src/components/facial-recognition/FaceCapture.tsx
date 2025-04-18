
import React, { useRef } from "react";
import { Sparkles } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import FaceCaptureCamera from "./FaceCaptureCamera";
import MatchedPersonCard from "./MatchedPersonCard";
import ScheduleDialog from "./ScheduleDialog";
import SearchButton from "./SearchButton";
import NoMatchFound from "./NoMatchFound";
import { useFacialRecognition } from "@/hooks/useFacialRecognition";

interface FaceCaptureProps {
  onCaptureImage?: (imageData: string) => void;
  capturedImage?: string | null;
  setCapturedImage?: (image: string | null) => void;
  isCameraActive?: boolean;
  setIsCameraActive?: (active: boolean) => void;
  isRegistrationMode?: boolean;
}

const FaceCapture: React.FC<FaceCaptureProps> = ({
  onCaptureImage,
  capturedImage: externalCapturedImage,
  setCapturedImage: setExternalCapturedImage,
  isCameraActive: externalIsCameraActive,
  setIsCameraActive: setExternalIsCameraActive,
  isRegistrationMode = false,
}) => {
  const [internalIsCameraActive, setInternalIsCameraActive] = React.useState(false);
  const [internalCapturedImage, setInternalCapturedImage] = React.useState<string | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = React.useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    setNoMatchFound
  } = useFacialRecognition();

  const handleStartCamera = () => {
    setIsCameraActive(true);
    setNoMatchFound(false);
  };

  const handleCapture = () => {
    if (canvasRef.current) {
      const imageDataUrl = canvasRef.current.toDataURL('image/png');
      setCapturedImage(imageDataUrl);
      if (onCaptureImage) onCaptureImage(imageDataUrl);
    }
    setIsCameraActive(false);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setIsCameraActive(false);
    setNoMatchFound(false);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full">
        {!isRegistrationMode && (
          <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Connect with RealYou
            </span>
            <Sparkles className="h-5 w-5 text-blue-500" />
          </h2>
        )}
        
        <FaceCaptureCamera
          isCameraActive={isCameraActive}
          capturedImage={capturedImage}
          onStartCamera={handleStartCamera}
          onCapture={handleCapture}
          onReset={handleReset}
        />

        <canvas ref={canvasRef} className="hidden" />

        {capturedImage && !matchedPerson && !noMatchFound && !isRegistrationMode && (
          <SearchButton 
            isSearching={isSearching}
            onClick={() => handleSearch(capturedImage)}
          />
        )}

        {noMatchFound && (
          <NoMatchFound onReset={handleReset} />
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
