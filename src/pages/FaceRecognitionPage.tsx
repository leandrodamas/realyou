
import React from "react";
import FaceCapture from "@/components/facial-recognition/FaceCapture";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FaceRecognitionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 flex items-center border-b border-gray-100 shadow-sm">
        <Link to="/" className="mr-4 rounded-full hover:bg-gray-100 p-2 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </Link>
        <h1 className="text-xl font-medium bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Face Recognition</h1>
      </header>

      {/* Face Recognition Component with creative styling */}
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-white rounded-xl shadow-xl overflow-hidden">
            <FaceCapture />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognitionPage;
