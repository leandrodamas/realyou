
import React from "react";
import Stories from "@/components/home/Stories";
import Feed from "@/components/home/Feed";
import { Search, SendHorizontal } from "lucide-react";

const Index: React.FC = () => {
  return (
    <div className="bg-gray-50">
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
    </div>
  );
};

export default Index;
