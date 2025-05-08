
import React, { useState, useEffect } from "react";
import { Professional } from "@/types/Professional";
import { getProfessionals, filterProfessionals } from "@/services/professionalService";
import SearchHeader from "@/components/search/SearchHeader";
import FilterDrawer from "@/components/search/FilterDrawer";
import ActiveFilters from "@/components/search/ActiveFilters";
import ViewToggle from "@/components/search/ViewToggle";
import MapView from "@/components/search/MapView";
import ListView from "@/components/search/ListView";

const AdvancedSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"map" | "list">("map");
  const [priceRange, setPriceRange] = useState([50, 200]); // Min-max price range
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [maxDistance, setMaxDistance] = useState(10); // km
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch professionals data on component mount
  useEffect(() => {
    const fetchProfessionals = async () => {
      setIsLoading(true);
      try {
        const data = await getProfessionals();
        setProfessionals(data);
      } catch (error) {
        console.error("Error fetching professionals:", error);
        setProfessionals([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfessionals();
  }, []);

  const addRemoveFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const resetAllFilters = () => {
    setPriceRange([50, 200]);
    setMaxDistance(10);
    setActiveFilters([]);
    setSearchTerm("");
  };

  // Filter professionals based on active filters and search term
  const filteredProfessionals = filterProfessionals(
    professionals,
    searchTerm,
    priceRange,
    maxDistance,
    activeFilters
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <SearchHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilterDrawer={showFilterDrawer}
        setShowFilterDrawer={setShowFilterDrawer}
      />
      
      <ActiveFilters 
        priceRange={priceRange}
        maxDistance={maxDistance}
        activeFilters={activeFilters}
        resetFilters={resetAllFilters}
      />
      
      <ViewToggle view={view} setView={setView} />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          {view === "map" && <MapView professionals={filteredProfessionals} />}
          
          {view === "list" && (
            <ListView 
              professionals={filteredProfessionals} 
              resetAllFilters={resetAllFilters}
            />
          )}
        </>
      )}

      <FilterDrawer
        open={showFilterDrawer}
        onOpenChange={setShowFilterDrawer}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        activeFilters={activeFilters}
        addRemoveFilter={addRemoveFilter}
        resetFilters={resetAllFilters}
      />
    </div>
  );
};

export default AdvancedSearchPage;
