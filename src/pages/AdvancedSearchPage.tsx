
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SearchHeader from "@/components/search/SearchHeader";
import ViewToggle from "@/components/search/ViewToggle";
import ListView from "@/components/search/ListView";
import MapView from "@/components/search/MapView";
import FilterDrawer from "@/components/search/FilterDrawer";
import ActiveFilters from "@/components/search/ActiveFilters";
import { useSearchProfessionals } from "@/hooks/useSearchProfessionals";
import { Professional as SearchProfessional } from "@/hooks/useSearchProfessionals";
import { Professional as DisplayProfessional } from "@/types/Professional";
import { toast } from "sonner";

const AdvancedSearchPage: React.FC = () => {
  const [view, setView] = useState<"list" | "map">("map");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const { professionals: searchProfessionals, isLoading } = useSearchProfessionals(searchTerm);
  const [error, setError] = useState<Error | null>(null);

  // Convert between professional types
  const convertProfessionals = (pros: SearchProfessional[]): DisplayProfessional[] => {
    return pros.map(pro => ({
      id: pro.id,
      name: pro.name,
      title: pro.title || "Professional",
      rating: pro.rating || 4.5,
      reviews: 0,
      price: 100, // Default price
      distance: 2.5, // Default distance
      available: "Hoje",
      image: pro.avatar || "/placeholder.svg",
      coordinates: [0, 0] // Default coordinates, should be updated with real data
    }));
  };

  const professionals = searchProfessionals ? convertProfessionals(searchProfessionals) : [];

  const resetFilters = () => {
    setPriceRange([0, 500]);
    setMaxDistance(10);
    setActiveFilters([]);
  };

  useEffect(() => {
    console.log("Advanced Search Page loaded, showing", view, "view");
    
    if (error) {
      console.error("Error loading professionals:", error);
      toast.error("Não foi possível carregar os profissionais");
    }
    
    // Log when page is loaded
    console.log("Advanced Search Page mounted with professionals:", professionals?.length || 0);
  }, [view, error, professionals]);

  return (
    <motion.div
      className="pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      data-testid="advanced-search-page"
    >
      <SearchHeader 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        showFilterDrawer={showFilterDrawer} 
        setShowFilterDrawer={setShowFilterDrawer}
      />
      
      <div className="px-4 pt-2">
        <ViewToggle view={view} setView={setView} />
        <ActiveFilters 
          priceRange={priceRange} 
          maxDistance={maxDistance} 
          activeFilters={activeFilters}
          resetFilters={resetFilters}
        />
      </div>
      
      {view === "list" ? (
        <ListView professionals={professionals || []} isLoading={isLoading} />
      ) : (
        <MapView professionals={professionals || []} isLoading={isLoading} />
      )}

      <FilterDrawer 
        open={showFilterDrawer}
        onOpenChange={setShowFilterDrawer}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
    </motion.div>
  );
};

export default AdvancedSearchPage;
