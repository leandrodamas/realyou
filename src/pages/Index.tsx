
import React from "react";
import Feed from "@/components/home/Feed";
import HomeHeader from "@/components/home/HomeHeader";
import FeatureCards from "@/components/home/FeatureCards";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import CameraButton from "@/components/home/CameraButton";

const Index: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <HomeHeader />
      <FeatureCards />
      <WelcomeBanner />
      
      {/* Feed */}
      <div className="mt-4">
        <Feed />
      </div>

      <CameraButton />
    </div>
  );
};

export default Index;
