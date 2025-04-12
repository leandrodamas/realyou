
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPin, Search, ArrowLeft, Filter, Clock, DollarSign, Star, 
  Calendar, Users, X, Layers, ChevronsUpDown, Zap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Drawer, 
  DrawerClose, 
  DrawerContent, 
  DrawerTrigger 
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ThreeDMap from "@/components/search/ThreeDMap";
import ProfessionalCard from "@/components/search/ProfessionalCard";

const AdvancedSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"map" | "list">("map");
  const [priceRange, setPriceRange] = useState([50, 200]); // Min-max price range
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [maxDistance, setMaxDistance] = useState(10); // km
  
  // Mock professionals data with coordinates for 3D map
  const professionals = [
    {
      id: 1,
      name: "Dr. Carlos Silva",
      title: "Desenvolvedor Senior",
      rating: 4.9,
      reviews: 132,
      price: 180,
      distance: 2.3, // km
      available: "Hoje",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      coordinates: [-43.182365, -22.951878], // Rio coordinates
    },
    {
      id: 2,
      name: "Maria Souza",
      title: "Designer UX/UI",
      rating: 4.7,
      reviews: 98,
      price: 150,
      distance: 1.5,
      available: "Amanhã",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      coordinates: [-43.185365, -22.954878],
    },
    {
      id: 3,
      name: "Pedro Almeida",
      title: "Arquiteto de Software",
      rating: 4.8,
      reviews: 76,
      price: 220,
      distance: 3.8,
      available: "Hoje",
      image: "https://randomuser.me/api/portraits/men/62.jpg",
      coordinates: [-43.188365, -22.958878],
    },
    {
      id: 4,
      name: "Ana Costa",
      title: "Product Manager",
      rating: 4.5,
      reviews: 45,
      price: 190,
      distance: 5.1,
      available: "Em 2 dias",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      coordinates: [-43.192365, -22.961878],
    }
  ];

  const addRemoveFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // Filter professionals based on active filters and search term
  const filteredProfessionals = professionals.filter(pro => {
    // Apply search term filter
    if (searchTerm && !pro.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !pro.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply price range filter
    if (pro.price < priceRange[0] || pro.price > priceRange[1]) {
      return false;
    }
    
    // Apply distance filter
    if (pro.distance > maxDistance) {
      return false;
    }
    
    // Apply specific filters
    if (activeFilters.includes("today") && pro.available !== "Hoje") {
      return false;
    }
    
    if (activeFilters.includes("highRated") && pro.rating < 4.8) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
        <Link to="/" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="bg-gray-100 pl-9 rounded-full"
            placeholder="Buscar profissionais por nome ou especialidade"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="search"
          />
        </div>
        <Drawer open={showFilterDrawer} onOpenChange={setShowFilterDrawer}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2">
              <Filter className="h-5 w-5" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4 pb-8">
            <div className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full my-2"></div>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Filtros</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-purple-600 text-sm"
                  onClick={() => {
                    setPriceRange([50, 200]);
                    setMaxDistance(10);
                    setActiveFilters([]);
                  }}
                >
                  Limpar todos
                </Button>
              </div>
              
              {/* Disponibilidade */}
              <div>
                <h4 className="font-medium mb-2">Disponibilidade</h4>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant={activeFilters.includes("today") ? "default" : "outline"} 
                    size="sm"
                    className={cn(
                      activeFilters.includes("today") ? "bg-purple-600" : "",
                      "rounded-full"
                    )}
                    onClick={() => addRemoveFilter("today")}
                  >
                    <Zap className={cn(
                      "h-3.5 w-3.5 mr-1",
                      !activeFilters.includes("today") && "text-purple-600"
                    )} />
                    Disponível hoje
                  </Button>
                  <Button 
                    variant={activeFilters.includes("thisWeek") ? "default" : "outline"} 
                    size="sm"
                    className={cn(
                      activeFilters.includes("thisWeek") ? "bg-purple-600" : "",
                      "rounded-full"
                    )}
                    onClick={() => addRemoveFilter("thisWeek")}
                  >
                    <Calendar className={cn(
                      "h-3.5 w-3.5 mr-1",
                      !activeFilters.includes("thisWeek") && "text-purple-600"
                    )} />
                    Esta semana
                  </Button>
                </div>
              </div>
              
              {/* Preço */}
              <div>
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Preço</h4>
                  <span className="text-sm">R${priceRange[0]} - R${priceRange[1]}</span>
                </div>
                <Slider 
                  min={50}
                  max={300}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>R$50</span>
                  <span>R$300</span>
                </div>
              </div>
              
              {/* Distância */}
              <div>
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Distância máxima</h4>
                  <span className="text-sm">{maxDistance} km</span>
                </div>
                <Slider 
                  min={1}
                  max={20}
                  step={1}
                  value={[maxDistance]}
                  onValueChange={([value]) => setMaxDistance(value)}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 km</span>
                  <span>20 km</span>
                </div>
              </div>
              
              {/* Avaliação */}
              <div>
                <h4 className="font-medium mb-2">Avaliação</h4>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant={activeFilters.includes("highRated") ? "default" : "outline"} 
                    size="sm"
                    className={cn(
                      activeFilters.includes("highRated") ? "bg-purple-600" : "",
                      "rounded-full"
                    )}
                    onClick={() => addRemoveFilter("highRated")}
                  >
                    <Star className={cn(
                      "h-3.5 w-3.5 mr-1",
                      activeFilters.includes("highRated") ? "text-yellow-300 fill-yellow-300" : "text-yellow-400"
                    )} />
                    4.8+
                  </Button>
                </div>
              </div>
              
              <DrawerClose asChild>
                <Button className="w-full">
                  Aplicar filtros
                </Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </header>
      
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="bg-white px-4 py-2 border-b flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Badge variant="outline" className="flex gap-1 bg-purple-50 border-purple-200">
            <DollarSign className="h-3 w-3" />
            R${priceRange[0]} - R${priceRange[1]}
          </Badge>
          <Badge variant="outline" className="flex gap-1 bg-purple-50 border-purple-200">
            <MapPin className="h-3 w-3" />
            Até {maxDistance}km
          </Badge>
          {activeFilters.includes("today") && (
            <Badge variant="outline" className="flex gap-1 bg-purple-50 border-purple-200">
              <Clock className="h-3 w-3" />
              Hoje
            </Badge>
          )}
          {activeFilters.includes("highRated") && (
            <Badge variant="outline" className="flex gap-1 bg-purple-50 border-purple-200">
              <Star className="h-3 w-3" />
              4.8+
            </Badge>
          )}
          <Button 
            variant="ghost" 
            className="text-xs text-gray-500 p-0 h-auto"
            onClick={() => {
              setPriceRange([50, 200]);
              setMaxDistance(10);
              setActiveFilters([]);
            }}
          >
            Limpar
          </Button>
        </div>
      )}
      
      {/* View Toggle */}
      <div className="bg-white border-b">
        <div className="flex justify-center p-2">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-full",
                view === "map" && "bg-white shadow-sm"
              )}
              onClick={() => setView("map")}
            >
              <Layers className="h-4 w-4 mr-1" />
              Mapa 3D
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "rounded-full",
                view === "list" && "bg-white shadow-sm"
              )}
              onClick={() => setView("list")}
            >
              <Users className="h-4 w-4 mr-1" />
              Lista
            </Button>
          </div>
        </div>
      </div>
      
      {/* Map View */}
      {view === "map" && (
        <div className="relative">
          <div className="h-[calc(100vh-150px)]">
            <ThreeDMap professionals={filteredProfessionals} />
          </div>
          
          {/* Bottom drawer with professionals */}
          <Drawer>
            <DrawerTrigger asChild>
              <div className="fixed bottom-24 left-0 right-0 bg-white rounded-t-xl shadow-lg border-t border-gray-200 p-4">
                <div className="flex justify-center">
                  <div className="w-12 h-1 bg-gray-300 rounded-full mb-2"></div>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{filteredProfessionals.length} profissionais encontrados</h3>
                  <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                </div>
                <div className="mt-2 overflow-hidden">
                  {filteredProfessionals.slice(0, 1).map(pro => (
                    <div key={pro.id} className="flex items-center gap-3">
                      <img 
                        src={pro.image} 
                        alt={pro.name}
                        className="w-10 h-10 rounded-full object-cover" 
                      />
                      <div className="flex-1">
                        <p className="font-medium">{pro.name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                          {pro.rating} • {pro.distance}km
                        </div>
                      </div>
                      <p className="text-right">
                        <span className="font-semibold">R${pro.price}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <div className="mx-auto w-12 h-1.5 bg-gray-300 rounded-full my-2"></div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-4">{filteredProfessionals.length} profissionais encontrados</h3>
                <div className="space-y-4">
                  {filteredProfessionals.map(pro => (
                    <ProfessionalCard key={pro.id} professional={pro} />
                  ))}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}
      
      {/* List View */}
      {view === "list" && (
        <div className="p-4 space-y-4">
          {filteredProfessionals.length > 0 ? (
            filteredProfessionals.map(pro => (
              <ProfessionalCard key={pro.id} professional={pro} />
            ))
          ) : (
            <div className="text-center py-8">
              <X className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">Nenhum profissional encontrado</p>
              <p className="text-sm text-gray-400">Tente ajustar seus filtros</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setPriceRange([50, 200]);
                  setMaxDistance(10);
                  setActiveFilters([]);
                  setSearchTerm("");
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchPage;
