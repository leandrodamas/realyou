
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import SearchHeader from "@/components/search/SearchHeader";
import ViewToggle from "@/components/search/ViewToggle";
import ListView from "@/components/search/ListView";
import MapView from "@/components/search/MapView";
import FilterDrawer from "@/components/search/FilterDrawer";
import ActiveFilters from "@/components/search/ActiveFilters";
import { useSearchProfessionals } from "@/hooks/useSearchProfessionals";
import { toast } from "sonner";

const AdvancedSearchPage: React.FC = () => {
  const [view, setView] = React.useState<"list" | "map">("map");
  const { professionals, isLoading, error } = useSearchProfessionals();

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
      <SearchHeader />
      
      <div className="px-4 pt-2">
        <ViewToggle view={view} setView={setView} />
        <ActiveFilters />
      </div>
      
      {view === "list" ? (
        <ListView professionals={professionals || []} isLoading={isLoading} />
      ) : (
        <MapView professionals={professionals || []} isLoading={isLoading} />
      )}

      <FilterDrawer />
    </motion.div>
  );
};

export default AdvancedSearchPage;
