
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, UserPlus, X } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-4">Connect via Face Recognition</h2>
        
        <div className="bg-gray-100 rounded-lg aspect-square w-full relative overflow-hidden">
          {isCameraActive ? (
            <div className="flex flex-col items-center justify-center h-full">
              {/* Camera view would be shown here in a real implementation */}
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <p className="text-white">Camera Preview</p>
              </div>
              <div className="absolute bottom-4 w-full flex justify-center">
                <Button onClick={handleCapture} className="rounded-full bg-white text-black">
                  <Camera className="h-6 w-6" />
                </Button>
              </div>
            </div>
          ) : capturedImage ? (
            <div className="relative w-full h-full">
              <img 
                src={capturedImage} 
                alt="Captured face" 
                className="w-full h-full object-cover"
              />
              <Button 
                variant="destructive" 
                size="icon"
                className="absolute top-2 right-2 rounded-full"
                onClick={handleReset}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500 mb-4">Take a picture to connect</p>
              <Button onClick={handleStartCamera} className="bg-whatsapp hover:bg-whatsapp-dark">
                Start Camera
              </Button>
            </div>
          )}
        </div>

        {capturedImage && (
          <div className="mt-4 space-y-2">
            <Button className="w-full bg-whatsapp hover:bg-whatsapp-dark" onClick={handleSearch}>
              <UserPlus className="mr-2 h-4 w-4" />
              Find Friends with Face Recognition
            </Button>
            <p className="text-xs text-gray-500 text-center">
              We'll notify people if we find a match, and they can choose to connect with you
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceCapture;
