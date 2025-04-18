
import React from "react";
import { MatchedPerson } from "../types/MatchedPersonTypes";

interface PersonHeaderProps {
  matchedPerson: MatchedPerson;
}

const PersonHeader: React.FC<PersonHeaderProps> = ({ matchedPerson }) => {
  return (
    <div className="flex items-center gap-3 pb-4 border-b">
      <img 
        src={matchedPerson.avatar} 
        alt={matchedPerson.name} 
        className="h-12 w-12 rounded-full object-cover"
      />
      <div>
        <h3 className="font-medium">{matchedPerson.name}</h3>
        <p className="text-xs text-gray-500">{matchedPerson.profession}</p>
      </div>
    </div>
  );
};

export default PersonHeader;
