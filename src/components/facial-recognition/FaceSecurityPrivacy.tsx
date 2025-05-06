
import React from "react";
import { ShieldCheck, Lock } from "lucide-react";

const FaceSecurityPrivacy: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-lg flex items-center gap-1.5 mb-3">
        <ShieldCheck className="h-5 w-5 text-purple-500" />
        Segurança e Privacidade
      </h3>
      
      <div className="space-y-3 text-sm text-gray-600">
        <p className="flex items-start gap-2">
          <Lock className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
          <span>Suas imagens são processadas com segurança e criptografadas.</span>
        </p>
        <p className="flex items-start gap-2">
          <Lock className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
          <span>Não compartilhamos suas fotos com terceiros sem sua permissão.</span>
        </p>
        <p className="flex items-start gap-2">
          <Lock className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
          <span>Você tem controle total sobre quais informações suas são visíveis para outros usuários.</span>
        </p>
      </div>
    </div>
  );
};

export default FaceSecurityPrivacy;
