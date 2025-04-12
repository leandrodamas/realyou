
import React from "react";
import { Link } from "react-router-dom";
import { Camera } from "lucide-react";

const CameraButton: React.FC = () => {
  return (
    <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50">
      <Link 
        to="/face-recognition" 
        className="rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 p-3 shadow-lg border-4 border-white">
        <Camera className="h-8 w-8 text-white" />
      </Link>
    </div>
  );
};

export default CameraButton;
