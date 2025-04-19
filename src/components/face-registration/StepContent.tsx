
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FaceRegistration from "@/components/facial-recognition/FaceRegistration";

interface StepContentProps {
  step: number;
  username: string;
  setUsername: (username: string) => void;
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
  handleStartCamera?: () => void;
  handleCapture?: () => void;
  handleReset?: () => void;
  isCameraActive?: boolean;
  setIsCameraActive?: (active: boolean) => void;
}

const StepContent: React.FC<StepContentProps> = ({
  step,
  username,
  setUsername,
  capturedImage,
  setCapturedImage,
}) => {
  return (
    <>
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Cadastre seu Rosto</h2>
            <p className="text-gray-600 mb-6">
              Use seu rosto como identificação única no RealYou. Essa foto será usada para seu perfil e login.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-white rounded-xl shadow-xl overflow-hidden p-4">
              <FaceRegistration 
                onImageCaptured={setCapturedImage}
                defaultImage={capturedImage}
              />
            </div>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Crie seu Perfil</h2>
            <p className="text-gray-600 mb-6">
              Escolha um nome de usuário para que outros possam te encontrar
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-8 flex items-center justify-center">
              {capturedImage && (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-100">
                  <img 
                    src={capturedImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  placeholder="Escolha um nome de usuário único"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Configurações de Privacidade</h2>
            <p className="text-gray-600 mb-6">
              Controle como seu rosto será usado no aplicativo
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Login com Reconhecimento Facial</h3>
                  <p className="text-sm text-gray-500">Use seu rosto para entrar no aplicativo</p>
                </div>
                <div className="form-control">
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notificações Biométricas</h3>
                  <p className="text-sm text-gray-500">Receba alertas sobre atividades da sua conta</p>
                </div>
                <div className="form-control">
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default StepContent;
