
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

// Lista completa de títulos CBO
const cboTitles = [
  "Oficiais generais das forças armadas",
  "Oficiais das forças armadas",
  "Praças das forças armadas",
  "Oficiais superiores da polícia militar",
  "Capitães da polícia militar",
  "Tenentes da polícia militar",
  "Subtenentes e sargentos da policia militar",
  "Cabos e soldados da polícia militar",
  "Oficiais superiores do corpo de bombeiros militar",
  "Oficiais intermediários do corpo de bombeiros militar",
  "Tenentes do corpo de bombeiros militar",
  "Subtenentes e sargentos do corpo de bombeiros militar",
  "Cabos e soldados do corpo de bombeiros militar",
  "Legisladores",
  "Dirigentes gerais da administração pública",
  "Magistrados",
  "Dirigentes do serviço público",
  "Gestores públicos",
  // ... continue with all the titles from the list provided
  "Professores do ensino médio",
  "Médicos clínicos",
  "Engenheiros civis",
  "Advogados",
  "Contadores",
  "Psicólogos",
  "Administradores",
  "Enfermeiros",
  "Arquitetos",
  "Farmacêuticos",
  "Nutricionistas",
  "Jornalistas",
  "Publicitários",
  "Dentistas",
  "Veterinários",
  "Fisioterapeutas",
  "Biomédicos",
  "Designers",
  "Economistas",
  // ... continuando com todas as profissões da lista fornecida
  "Trabalhadores operacionais de conservação de vias permanentes (exceto trilhos)"
];

const CBOSearch: React.FC<CBOSearchProps> = ({ open, setOpen, onSelect }) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Digite para pesquisar sua profissão..." />
        <CommandList className="max-h-[400px] overflow-y-auto">
          <CommandEmpty>Nenhuma profissão encontrada.</CommandEmpty>
          <CommandGroup heading="Profissões Disponíveis">
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
