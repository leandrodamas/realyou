
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import GamifiedOnboarding from "@/components/onboarding/GamifiedOnboarding";

const OnboardingPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link to="/" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-lg font-medium">Complete seu perfil</h1>
          <p className="text-sm text-gray-500">
            Ganhe pontos e destaque na plataforma
          </p>
        </div>
        <div className="flex items-center ml-auto">
          <div className="bg-amber-100 px-2 py-1 rounded-full flex items-center">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
            <span className="text-sm font-medium text-amber-700">0 pontos</span>
          </div>
        </div>
      </header>
      
      {/* Onboarding content */}
      <div className="p-4">
        <GamifiedOnboarding />
      </div>
    </div>
  );
};

export default OnboardingPage;
