
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Search, MessageSquare, User } from "lucide-react";

const NavBar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 shadow-lg z-40">
      <div className="grid grid-cols-4 py-3 px-2">
        <Link to="/" className="flex flex-col items-center justify-center">
          <div className={`p-2 rounded-full ${isActive("/") ? "bg-gradient-to-r from-purple-600/10 to-blue-500/10" : ""}`}>
            <Home className={`h-6 w-6 ${isActive("/") ? "text-purple-600" : "text-gray-500"}`} />
          </div>
          <span className={`text-xs mt-1 ${isActive("/") ? "text-purple-600 font-medium" : "text-gray-500"}`}>Home</span>
        </Link>
        
        <Link to="/search" className="flex flex-col items-center justify-center">
          <div className={`p-2 rounded-full ${isActive("/search") ? "bg-gradient-to-r from-purple-600/10 to-blue-500/10" : ""}`}>
            <Search className={`h-6 w-6 ${isActive("/search") ? "text-purple-600" : "text-gray-500"}`} />
          </div>
          <span className={`text-xs mt-1 ${isActive("/search") ? "text-purple-600 font-medium" : "text-gray-500"}`}>Search</span>
        </Link>
        
        <Link to="/chats" className="flex flex-col items-center justify-center">
          <div className={`p-2 rounded-full ${isActive("/chats") ? "bg-gradient-to-r from-purple-600/10 to-blue-500/10" : ""}`}>
            <MessageSquare className={`h-6 w-6 ${isActive("/chats") ? "text-purple-600" : "text-gray-500"}`} />
          </div>
          <span className={`text-xs mt-1 ${isActive("/chats") ? "text-purple-600 font-medium" : "text-gray-500"}`}>Chats</span>
        </Link>
        
        <Link to="/profile" className="flex flex-col items-center justify-center">
          <div className={`p-2 rounded-full ${isActive("/profile") ? "bg-gradient-to-r from-purple-600/10 to-blue-500/10" : ""}`}>
            <User className={`h-6 w-6 ${isActive("/profile") ? "text-purple-600" : "text-gray-500"}`} />
          </div>
          <span className={`text-xs mt-1 ${isActive("/profile") ? "text-purple-600 font-medium" : "text-gray-500"}`}>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
