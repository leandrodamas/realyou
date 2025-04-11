
import React from "react";
import Stories from "@/components/home/Stories";
import Feed from "@/components/home/Feed";
import { Search, Bell, User, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-gray-100 shadow-sm">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">RealYou</h1>
        <div className="flex space-x-3">
          <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors">
            <Search className="h-5 w-5 text-gray-600" />
          </button>
          <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors">
            <User className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Stories */}
      <div className="mt-4 px-4">
        <Stories />
      </div>

      {/* Feed */}
      <div className="mt-4">
        <Feed />
      </div>

      {/* Custom Camera Button (Center) */}
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50">
        <Link 
          to="/face-recognition" 
          className="rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 p-3 shadow-lg border-4 border-white">
          <Camera className="h-8 w-8 text-white" />
        </Link>
      </div>
    </div>
  );
};

export default Index;
