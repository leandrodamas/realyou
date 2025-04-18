
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  FileKey, 
  UserCog,
  Database,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const FaceSecurityPrivacy: React.FC = () => {
  const [dataRetention, setDataRetention] = useState("30days");
  const [autoDelete, setAutoDelete] = useState(true);
  const [allowAnalytics, setAllowAnalytics] = useState(false);
  const [allowExport, setAllowExport] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-xl p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="h-5 w-5 text-green-600" />
        <h2 className="text-lg font-semibold">Segurança e Privacidade</h2>
      </div>

      <div className="space-y-5">
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2 text-gray-800">
            <Lock className="h-4 w-4 text-purple-600" />
            Armazenamento de dados faciais
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-delete" className="text-sm">Exclusão automática</Label>
              <p className="text-xs text-gray-500">Excluir dados após período de inatividade</p>
            </div>
            <Switch 
              id="auto-delete" 
              checked={autoDelete}
              onCheckedChange={setAutoDelete}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="biometric-lock" className="text-sm">Bloqueio biométrico</Label>
              <p className="text-xs text-gray-500">Exigir senha/face para alterar configurações</p>
            </div>
            <Switch 
              id="biometric-lock" 
              checked={biometricLock}
              onCheckedChange={setBiometricLock}
            />
          </div>
        </div>
        
        <div className="pt-2 space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2 text-gray-800">
            <Database className="h-4 w-4 text-purple-600" />
            Uso de dados
          </h3>
          
          <div className="flex items-center gap-2">
            <Checkbox 
              id="analytics-checkbox"
              checked={allowAnalytics}
              onCheckedChange={(checked) => setAllowAnalytics(checked as boolean)}
            />
            <div>
              <Label htmlFor="analytics-checkbox" className="text-sm">Melhorias do sistema</Label>
              <p className="text-xs text-gray-500">Ajude a melhorar o reconhecimento facial</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox 
              id="export-checkbox" 
              checked={allowExport}
              onCheckedChange={(checked) => setAllowExport(checked as boolean)}
            />
            <div>
              <Label htmlFor="export-checkbox" className="text-sm">Exportação de dados</Label>
              <p className="text-xs text-gray-500">Permitir exportar seus dados faciais</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-md mt-4 flex gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <p className="text-xs text-yellow-700">
              A desativação completa do reconhecimento facial pode ser feita nas configurações de conta.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Link to="/settings">
            <Button variant="outline" size="sm" className="text-xs">
              Configurações avançadas
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FaceSecurityPrivacy;
