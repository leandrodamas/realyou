
import React from "react";
import { Edit, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatsHeader: React.FC = () => {
  return (
    <>
      {/* Header */}
      <header className="bg-white p-4 flex justify-between items-center border-b">
        <h1 className="text-xl font-bold">Chats</h1>
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Edit className="h-5 w-5" />
        </Button>
      </header>

      {/* Search */}
      <div className="p-4 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            className="bg-gray-100 pl-10 rounded-full"
            placeholder="Search"
            type="search"
          />
        </div>
      </div>
    </>
  );
};

export default ChatsHeader;
