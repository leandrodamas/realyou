
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const HeaderComponent = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-gray-100 shadow-sm">
      <Link to="/" className="rounded-full hover:bg-gray-100 p-2 transition-colors">
        <ArrowLeft className="h-5 w-5 text-gray-700" />
      </Link>
      <h1 className="text-xl font-medium bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        RealYou Setup
      </h1>
      <div className="w-9"></div>
    </header>
  );
};

export default HeaderComponent;
