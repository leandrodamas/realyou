
import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface SearchHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilterDrawer: boolean;
  setShowFilterDrawer: (show: boolean) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  showFilterDrawer,
  setShowFilterDrawer
}) => {
  return (
    <div className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar profissionais"
            className="pl-9 pr-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="search-input"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilterDrawer(!showFilterDrawer)}
          data-testid="filter-button"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SearchHeader;
