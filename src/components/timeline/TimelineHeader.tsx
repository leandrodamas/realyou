
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TimelineHeader: React.FC = () => {
  return (
    <header className="bg-white p-4 flex items-center border-b">
      <Link to="/" className="mr-4">
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <div>
        <h1 className="text-lg font-medium">Agenda Visual</h1>
        <p className="text-sm text-gray-500">
          Gerencie seus compromissos
        </p>
      </div>
    </header>
  );
};

export default TimelineHeader;
