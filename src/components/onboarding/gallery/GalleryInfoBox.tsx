
import React from "react";
import { Image } from "lucide-react";
import { GalleryInfoBoxProps } from "./types";

const GalleryInfoBox: React.FC<GalleryInfoBoxProps> = () => {
  return (
    <div className="bg-gray-50 border rounded-lg p-3 mb-3">
      <div className="flex items-center mb-2">
        <Image className="h-5 w-5 text-purple-500 mr-2" />
        <span className="font-medium">Mostre seu trabalho!</span>
      </div>
      <p className="text-sm text-gray-600">
        Adicione fotos dos seus melhores trabalhos para atrair mais clientes.
        Os perfis com galeria recebem até 3x mais visualizações.
      </p>
    </div>
  );
};

export default GalleryInfoBox;
