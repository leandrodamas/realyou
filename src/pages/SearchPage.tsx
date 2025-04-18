
import React, { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Map, Filter, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const suggestedUsers = [
    { id: 1, name: "John Doe", username: "johndoe", avatar: "/placeholder.svg" },
    { id: 2, name: "Maria Silva", username: "mariasilva", avatar: "/placeholder.svg" },
    { id: 3, name: "Alex Johnson", username: "alexj", avatar: "/placeholder.svg" },
    { id: 4, name: "Sarah Parker", username: "sparker", avatar: "/placeholder.svg" },
  ];
  
  // Popular search categories
  const searchCategories = [
    { name: "Desenvolvimento Web", count: 156 },
    { name: "UX/UI Design", count: 89 },
    { name: "Marketing Digital", count: 124 },
    { name: "Consultoria de Negócios", count: 75 },
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>
      
      {/* Advanced Search Link */}
      <Link to="/advanced-search">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-4 text-white flex justify-between items-center shadow-md"
        >
          <div>
            <h3 className="font-medium">Busca Avançada 3D</h3>
            <p className="text-sm opacity-90">
              Encontre profissionais próximos a você
            </p>
          </div>
          <div className="flex items-center">
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              Novo
            </Badge>
            <Map className="h-6 w-6 ml-2" />
          </div>
        </motion.div>
      </Link>
      
      {/* Search Categories */}
      <div className="p-4">
        <h2 className="text-lg font-medium mb-3">Categorias populares</h2>
        <div className="flex flex-wrap gap-2">
          {searchCategories.map((category, index) => (
            <Button 
              key={index}
              variant="outline" 
              className="bg-white border-gray-200 rounded-full text-sm hover:bg-gray-50"
            >
              {category.name}
              <Badge 
                variant="outline" 
                size="sm" 
                className="ml-2 bg-gray-50 border-gray-200"
              >
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Sugeridos</h2>
          <Button variant="outline" size="sm" className="text-sm">
            <Filter className="h-4 w-4 mr-1" />
            Filtrar
          </Button>
        </div>
        
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
