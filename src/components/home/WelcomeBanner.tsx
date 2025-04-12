
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Stories from "@/components/home/Stories";

const WelcomeBanner: React.FC = () => {
  return (
    <div className="mt-4 px-4">
      <div className="bg-white rounded-xl shadow-md p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">New to RealYou?</h2>
        <p className="text-gray-600 text-sm mb-3">Register your face to connect with friends in a whole new way</p>
        <Link to="/register">
          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90">
            Get Started
          </Button>
        </Link>
      </div>
      <Stories />
    </div>
  );
};

export default WelcomeBanner;
