
import React from "react";
import FaceCapture from "@/components/facial-recognition/FaceCapture";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FaceRecognitionPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link to="/" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-medium">Face Recognition</h1>
      </header>

      {/* Face Recognition Component */}
      <div className="mt-4">
        <FaceCapture />
      </div>
    </div>
  );
};

export default FaceRecognitionPage;
