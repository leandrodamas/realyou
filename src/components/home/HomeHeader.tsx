
import React from "react";
import { Link } from "react-router-dom";
import { Search, Bell, User } from "lucide-react";

const HomeHeader: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-gray-100 shadow-sm">
      <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">RealYou</h1>
      <div className="flex space-x-3">
        <Link to="/search">
          <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors">
            <Search className="h-5 w-5 text-gray-600" />
          </button>
        </Link>
        <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>
        <Link to="/profile">
          <button className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors">
            <User className="h-5 w-5 text-gray-600" />
          </button>
        </Link>
      </div>
    </header>
  );
};

export default HomeHeader;
