
import React from "react";
import { Check, Search } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

interface CBOSearchProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (title: string) => void;
}

// Sample of CBO titles - in a real app, this would come from an API
const cboTitles = [
  "Desenvolvedor de Software",
  "Designer UX/UI",
  "Médico Clínico",
  "Engenheiro Civil",
  "Professor de Ensino Fundamental",
  "Administrador",
  "Contador",
  "Psicólogo",
  "Enfermeiro",
  "Advogado",
  // Add more professions as needed
];

const CBOSearch: React.FC<CBOSearchProps> = ({ open, setOpen, onSelect }) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Digite para pesquisar sua profissão..." />
        <CommandList>
          <CommandEmpty>Nenhuma profissão encontrada.</CommandEmpty>
          <CommandGroup heading="Profissões Sugeridas">
            {cboTitles.map((title) => (
              <CommandItem
                key={title}
                value={title}
                onSelect={() => {
                  onSelect(title);
                  setOpen(false);
                }}
              >
                <Check className="mr-2 h-4 w-4 opacity-0" />
                {title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default CBOSearch;
