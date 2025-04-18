
import React from "react";
import { Link } from "react-router-dom";
import { Search, ArrowLeft, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";

interface SearchHeaderProps {
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
      </Drawer>
    </header>
  );
};

export default SearchHeader;
