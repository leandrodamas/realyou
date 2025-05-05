
import React from "react";
import { Button } from "@/components/ui/button";
import { SessionStatusProps } from "./types";

export const SessionStatus: React.FC<SessionStatusProps> = ({
  session,
  isUploading,
  selectedFile,
  title,
  handleSubmit
}) => {
  return (
    <>
      {session?.user ? (
        <Button 
          onClick={handleSubmit} 
          disabled={isUploading || !selectedFile || !title.trim()}
          className="w-full"
        >
          {isUploading ? "Salvando..." : "Salvar Trabalho"}
        </Button>
      ) : (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
          <p>Você precisa estar logado para adicionar trabalhos.</p>
          <p className="mt-1 text-xs">Se você já está logado e está vendo esta mensagem, tente atualizar a página.</p>
        </div>
      )}
      
      {/* Debug info - can be removed in production */}
      <div className="text-xs text-gray-400 mt-2">
        Status da sessão: {session ? "Conectado como " + session.user?.email : "Não conectado"}
      </div>
    </>
  );
};
