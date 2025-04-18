
import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SettingsHeader = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md p-4 flex justify-between items-center border-b sticky top-0 z-10">
      <Link to="/profile" className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ChevronRight className="h-5 w-5 text-gray-500 rotate-180" />
        </Button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Configurações</h1>
      </Link>
      
      <div className="flex overflow-x-auto gap-2 px-2 py-1 no-scrollbar">
        {["privacy", "subscription", "stories", "photos", "achievements", "notifications"].map((section) => (
          <Button 
            key={section}
            variant="ghost" 
            size="sm" 
            className={`whitespace-nowrap text-xs px-3`}
            onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })}
          >
            {section === "privacy" && "Privacidade"}
            {section === "subscription" && "Assinatura"}
            {section === "stories" && "Stories"}
            {section === "photos" && "Fotos"}
            {section === "achievements" && "Conquistas"}
            {section === "notifications" && "Notificações"}
          </Button>
        ))}
      </div>
      
      <Button variant="ghost" size="sm">Salvar</Button>
    </header>
  );
};

export default SettingsHeader;
