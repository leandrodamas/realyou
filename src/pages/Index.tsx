
import React from "react";
import NavBar from "@/components/layout/NavBar";
import Stories from "@/components/home/Stories";
import Feed from "@/components/home/Feed";
import { Search, SendHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

const Index: React.FC = () => {
  return (
    <div className="pb-16 bg-gray-50">
      {/* Header */}
      <header className="bg-white p-4 flex justify-between items-center border-b">
        <h1 className="text-xl font-bold text-whatsapp-dark">FaceConnect</h1>
        <div className="flex space-x-2">
          <Search className="h-6 w-6 text-gray-500" />
          <SendHorizontal className="h-6 w-6 text-gray-500" />
        </div>
      </header>

      {/* Stories */}
      <div className="bg-white mb-2">
        <Stories />
      </div>

      {/* Feed */}
      <Feed />

      {/* Navigation Bar */}
      <NavBar />
    </div>
  );
};

export default Index;
