
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const SearchPage: React.FC = () => {
  const suggestedUsers = [
    { id: 1, name: "John Doe", username: "johndoe", avatar: "/placeholder.svg" },
    { id: 2, name: "Maria Silva", username: "mariasilva", avatar: "/placeholder.svg" },
    { id: 3, name: "Alex Johnson", username: "alexj", avatar: "/placeholder.svg" },
    { id: 4, name: "Sarah Parker", username: "sparker", avatar: "/placeholder.svg" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b">
        <Link to="/" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="bg-gray-100 pl-9 rounded-full"
            placeholder="Search"
            type="search"
          />
        </div>
      </header>

      {/* Recent Searches */}
      <div className="p-4">
        <h2 className="text-lg font-medium mb-4">Suggested</h2>
        
        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <img src={user.avatar} alt={user.name} className="object-cover" />
                </Avatar>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
