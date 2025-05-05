
import React, { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Map, Filter, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useSearchProfessionals } from "@/hooks/useSearchProfessionals";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { professionals, isLoading } = useSearchProfessionals(searchQuery);
  
  // Popular search categories
  const searchCategories = [
    { name: "Desenvolvimento Web", count: 156 },
    { name: "UX/UI Design", count: 89 },
    { name: "Marketing Digital", count: 124 },
    { name: "Consultoria de Negócios", count: 75 },
  ];

  return (
    <ProtectedRoute>
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
                onClick={() => setSearchQuery(category.name)}
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

        {/* Search Results */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              {searchQuery ? `Resultados para "${searchQuery}"` : "Sugeridos"}
            </h2>
            <Button variant="outline" size="sm" className="text-sm">
              <Filter className="h-4 w-4 mr-1" />
              Filtrar
            </Button>
          </div>
          
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : professionals.length > 0 ? (
            <div className="space-y-3">
              {professionals.map((professional) => (
                <div key={professional.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <img src={professional.avatar} alt={professional.name} className="object-cover" />
                    </Avatar>
                    <div>
                      <p className="font-medium">{professional.name}</p>
                      <p className="text-sm text-gray-500">
                        @{professional.username}
                        {professional.title && ` · ${professional.title}`}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Follow
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum resultado encontrado para "{searchQuery}"</p>
              <p className="text-sm mt-2">Tente com outros termos ou categorias</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SearchPage;
