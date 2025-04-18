
import React, { useState } from "react";
import FaceCapture from "@/components/facial-recognition/FaceCapture";
import { ArrowLeft, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription 
} from "@/components/ui/sheet";

const FaceRecognitionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'connect' | 'howItWorks'>('connect');

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-medium text-purple-600">Face Recognition</h1>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Info className="h-4 w-4 mr-1" />
              Sobre
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Reconhecimento Facial</SheetTitle>
              <SheetDescription>
                O reconhecimento facial ajuda você a encontrar e se conectar com outros profissionais
                de forma mais fácil e segura.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="font-medium">Como funciona:</h4>
                <p className="text-sm text-gray-600 mt-1">
                  1. Tire uma foto do seu rosto
                </p>
                <p className="text-sm text-gray-600">
                  2. Nosso sistema busca por correspondências
                </p>
                <p className="text-sm text-gray-600">
                  3. Quando encontramos uma correspondência, enviamos uma notificação à pessoa
                </p>
                <p className="text-sm text-gray-600">
                  4. Se a pessoa aceitar, vocês serão conectados
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      {/* Tabs */}
      <div className="flex p-2 bg-white">
        <div className="mx-auto flex space-x-2">
          <button
            onClick={() => setActiveTab('connect')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'connect' 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Encontrar Pessoas
          </button>
          <button
            onClick={() => setActiveTab('howItWorks')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'howItWorks' 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Como Funciona
          </button>
        </div>
      </div>

      {/* Content Based on Active Tab */}
      <div className="mt-4">
        {activeTab === 'connect' ? (
          <FaceCapture />
        ) : (
          <div className="p-4 max-w-md mx-auto">
            <h3 className="text-lg font-bold mb-4 text-center">Como Funciona o Reconhecimento Facial</h3>
            
            <div className="space-y-4">
              {/* Informações de como funciona */}
              <div className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-sm">
                <div className="bg-purple-100 rounded-full p-2 text-purple-600">1</div>
                <div>
                  <h4 className="font-medium">Capture sua foto</h4>
                  <p className="text-sm text-gray-600">Use sua câmera para tirar uma foto clara do seu rosto.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceRecognitionPage;
