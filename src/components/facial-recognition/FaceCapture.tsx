
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, UserPlus, X, Sparkles } from "lucide-react";

const FaceCapture: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleStartCamera = () => {
    setIsCameraActive(true);
    // In a real implementation, we would initialize the camera here
    // and set up facial recognition
  };

  const handleCapture = () => {
    // Simulate capturing an image
    setCapturedImage("/placeholder.svg");
    setIsCameraActive(false);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setIsCameraActive(false);
  };

  const handleSearch = () => {
    // In a real implementation, this would send the image for facial recognition matching
    console.log("Searching for face matches...");
    // Simulate processing
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full">
        <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Connect with RealYou</span>
          <Sparkles className="h-5 w-5 text-blue-500" />
        </h2>
        
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl aspect-square w-full relative overflow-hidden border border-gray-100 shadow-inner">
          {isCameraActive ? (
            <div className="flex flex-col items-center justify-center h-full">
              {/* Camera view would be shown here in a real implementation */}
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <p className="text-white">Camera Preview</p>
              </div>
              <div className="absolute bottom-4 w-full flex justify-center">
                <Button onClick={handleCapture} className="rounded-full size-16 bg-white text-purple-600 hover:bg-white/90 shadow-lg border border-purple-100">
                  <Camera className="h-8 w-8" />
                </Button>
              </div>
            </div>
          ) : capturedImage ? (
            <div className="relative w-full h-full">
              <img 
                src={capturedImage} 
                alt="Captured face" 
                className="w-full h-full object-cover rounded-2xl"
              />
              <Button 
                variant="destructive" 
                size="icon"
                className="absolute top-3 right-3 rounded-full shadow-md"
                onClick={handleReset}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-6 text-center">
                <p className="text-gray-600 mb-1">Take a picture to connect</p>
                <p className="text-xs text-gray-400">Be yourself, be real</p>
              </div>
              <Button 
                onClick={handleStartCamera} 
                className="rounded-full px-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md">
                Start Camera
              </Button>
            </div>
          )}
        </div>

        {capturedImage && (
          <div className="mt-6 space-y-3">
            <Button 
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md" 
              onClick={handleSearch}>
              <UserPlus className="mr-2 h-4 w-4" />
              Find Friends with Face Recognition
            </Button>
            <p className="text-xs text-gray-500 text-center px-4">
              We'll notify people if we find a match, and they can choose to connect with you
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceCapture;
