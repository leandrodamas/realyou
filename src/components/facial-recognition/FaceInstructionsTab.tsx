
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FaceInstructionsTab: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
      <h3 className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Como usar a Busca por Foto
      </h3>
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="bg-purple-100 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 font-medium">1</span>
          </div>
          <p className="text-sm text-gray-600">
            Posicione o rosto no centro da câmera em um ambiente bem iluminado
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-purple-100 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 font-medium">2</span>
          </div>
          <p className="text-sm text-gray-600">
            Aguarde a captura automática da melhor imagem
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-purple-100 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 font-medium">3</span>
          </div>
          <p className="text-sm text-gray-600">
            O app buscará correspondências com usuários do RealYou
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-purple-100 rounded-full h-7 w-7 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 font-medium">4</span>
          </div>
          <p className="text-sm text-gray-600">
            Se encontrar, envie uma solicitação de conexão para estabelecer contato
          </p>
        </div>
      </div>
      <div className="mt-6">
        <Button asChild variant="outline" className="w-full">
          <Link to="/register">
            Ainda não tem registro? Cadastre-se agora
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FaceInstructionsTab;
