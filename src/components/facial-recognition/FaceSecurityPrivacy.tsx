
import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  FileKey, 
  UserCog,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FaceSecurityPrivacy: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
    >
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-semibold">Segurança e Privacidade</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <Lock className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-sm">Criptografia de ponta a ponta</h3>
            <p className="text-xs text-gray-600">
              Seus dados faciais são protegidos com criptografia avançada, 
              tanto no dispositivo quanto durante qualquer transmissão.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <FileKey className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-sm">Armazenamento seguro</h3>
            <p className="text-xs text-gray-600">
              Os dados biométricos ficam armazenados apenas no seu dispositivo, 
              com opção de backup criptografado em nuvem.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Database className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-sm">Sem banco de dados compartilhado</h3>
            <p className="text-xs text-gray-600">
              Seus dados faciais não são compartilhados com terceiros nem utilizados 
              para criar um banco de dados centralizado.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <UserCog className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-sm">Controle total</h3>
            <p className="text-xs text-gray-600">
              Você decide quem pode te encontrar usando reconhecimento facial
              e pode desativar a função a qualquer momento.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Link to="/settings">
            <Button variant="outline" size="sm" className="text-xs">
              Ajustar configurações de privacidade
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FaceSecurityPrivacy;
