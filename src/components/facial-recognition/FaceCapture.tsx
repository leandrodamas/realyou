
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, UserPlus, X, Sparkles, Clock, User, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface MatchedPerson {
  name: string;
  profession: string;
  avatar: string;
  schedule: {
    day: string;
    slots: string[];
    active: boolean;
  }[];
}

const FaceCapture: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [matchedPerson, setMatchedPerson] = useState<MatchedPerson | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [connectionSent, setConnectionSent] = useState(false);

  const handleStartCamera = () => {
    setIsCameraActive(true);
    // In a real implementation, we would initialize the camera here
    // and set up facial recognition
  };

  const handleCapture = () => {
    // Simulate capturing an image
    setCapturedImage("/placeholder.svg");
    setIsCameraActive(false);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setIsCameraActive(false);
    setMatchedPerson(null);
    setIsSearching(false);
    setConnectionSent(false);
  };

  const handleSearch = () => {
    // Simulate searching for a face match
    setIsSearching(true);
    
    // Simulate a delay for processing
    setTimeout(() => {
      setIsSearching(false);
      setMatchedPerson({
        name: "Alex Johnson",
        profession: "Terapeuta",
        avatar: "/placeholder.svg",
        schedule: [
          { day: "Segunda", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Terça", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Quarta", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Quinta", slots: ["09:00 - 12:00", "14:00 - 18:00"], active: true },
          { day: "Sexta", slots: ["09:00 - 12:00", "14:00 - 16:00"], active: true },
          { day: "Sábado", slots: ["10:00 - 14:00"], active: false },
          { day: "Domingo", slots: [], active: false }
        ]
      });
    }, 2000);
  };

  const sendConnectionRequest = () => {
    setConnectionSent(true);
    toast.success("Solicitação de conexão enviada!");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full">
        <h2 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Connect with RealYou</span>
          <Sparkles className="h-5 w-5 text-blue-500" />
        </h2>
        
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl aspect-square w-full relative overflow-hidden border border-gray-100 shadow-inner">
          {isCameraActive ? (
            <div className="flex flex-col items-center justify-center h-full">
              {/* Camera view would be shown here in a real implementation */}
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <p className="text-white">Camera Preview</p>
              </div>
              <div className="absolute bottom-4 w-full flex justify-center">
                <Button onClick={handleCapture} className="rounded-full size-16 bg-white text-purple-600 hover:bg-white/90 shadow-lg border border-purple-100">
                  <Camera className="h-8 w-8" />
                </Button>
              </div>
            </div>
          ) : capturedImage ? (
            <div className="relative w-full h-full">
              <img 
                src={capturedImage} 
                alt="Captured face" 
                className="w-full h-full object-cover rounded-2xl"
              />
              <Button 
                variant="destructive" 
                size="icon"
                className="absolute top-3 right-3 rounded-full shadow-md"
                onClick={handleReset}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="mb-6 text-center">
                <p className="text-gray-600 mb-1">Tire uma foto para se conectar</p>
                <p className="text-xs text-gray-400">Seja você mesmo, seja real</p>
              </div>
              <Button 
                onClick={handleStartCamera} 
                className="rounded-full px-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md">
                Iniciar Câmera
              </Button>
            </div>
          )}
        </div>

        {capturedImage && !matchedPerson && (
          <div className="mt-6 space-y-3">
            <Button 
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md" 
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Procurando...
                </div>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Encontrar Profissionais com Reconhecimento Facial
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center px-4">
              Notificaremos as pessoas se encontrarmos uma correspondência, e elas poderão escolher se conectar com você
            </p>
          </div>
        )}

        <AnimatePresence>
          {matchedPerson && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 bg-white rounded-xl p-4 shadow-md border border-gray-100"
            >
              <div className="flex items-center gap-3">
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
              
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline"
                  className="flex-1 text-sm h-9"
                  onClick={() => setShowScheduleDialog(true)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Ver Horários
                </Button>
                
                <Button 
                  className={`flex-1 text-sm h-9 ${connectionSent ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-purple-600 to-blue-500'}`}
                  onClick={sendConnectionRequest}
                  disabled={connectionSent}
                >
                  {connectionSent ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Solicitação Enviada
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 mr-2" />
                      Enviar Solicitação
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Horários de Atendimento</DialogTitle>
          </DialogHeader>
          
          {matchedPerson && (
            <div className="mt-4 space-y-4">
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
              
              <div>
                <h4 className="text-sm font-medium mb-3">Disponibilidade Semanal</h4>
                <div className="space-y-3">
                  {matchedPerson.schedule
                    .filter(day => day.active)
                    .map((day, index) => (
                    <div key={index} className="border-b border-gray-100 pb-2 last:border-0">
                      <p className="text-sm font-medium">{day.day}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {day.slots.map((slot, slotIndex) => (
                          <Button
                            key={slotIndex}
                            variant="secondary"
                            className="text-xs h-7 px-2"
                            size="sm"
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => setShowScheduleDialog(false)}
                  className="bg-gradient-to-r from-purple-600 to-blue-500"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FaceCapture;
