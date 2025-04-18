
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Search, Camera, MessageSquare, User } from "lucide-react";

const NavBar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 py-2">
        <Link to="/" className="flex flex-col items-center justify-center">
          <Home className={`h-6 w-6 ${isActive("/") ? "text-whatsapp" : "text-gray-500"}`} />
          <span className={`text-xs mt-1 ${isActive("/") ? "text-whatsapp font-medium" : ""}`}>Home</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center justify-center">
          <Search className={`h-6 w-6 ${isActive("/search") ? "text-whatsapp" : "text-gray-500"}`} />
          <span className={`text-xs mt-1 ${isActive("/search") ? "text-whatsapp font-medium" : ""}`}>Search</span>
        </Link>
        <Link to="/face-recognition" className="flex flex-col items-center justify-center">
          <Camera className={`h-6 w-6 ${isActive("/face-recognition") ? "text-whatsapp" : "text-gray-500"}`} />
          <span className={`text-xs mt-1 ${isActive("/face-recognition") ? "text-whatsapp font-medium" : ""}`}>RealYou</span>
        </Link>
        <Link to="/chats" className="flex flex-col items-center justify-center">
          <MessageSquare className={`h-6 w-6 ${isActive("/chats") ? "text-whatsapp" : "text-gray-500"}`} />
          <span className={`text-xs mt-1 ${isActive("/chats") ? "text-whatsapp font-medium" : ""}`}>Chats</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center justify-center">
          <User className={`h-6 w-6 ${isActive("/profile") ? "text-whatsapp" : "text-gray-500"}`} />
          <span className={`text-xs mt-1 ${isActive("/profile") ? "text-whatsapp font-medium" : ""}`}>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
