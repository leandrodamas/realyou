
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Calendar, User, Settings, Award, Star, 
  CheckCircle, ArrowRight, Camera, Image, MapPin, Clock, Shield,
  BadgeCheck, Users, CreditCard, Zap, CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  completed: boolean;
  component: React.ReactNode;
}

const GamifiedOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "profile",
      title: "Complete seu perfil",
      description: "Adicione sua foto e informações profissionais",
      icon: <User className="h-5 w-5 text-purple-600" />,
      points: 20,
      completed: false,
      component: <ProfileStep onComplete={() => completeStep(0)} />
    },
    {
      id: "calendar",
      title: "Configure sua agenda",
      description: "Defina seus horários de disponibilidade",
      icon: <Calendar className="h-5 w-5 text-blue-600" />,
      points: 15,
      completed: false,
      component: <CalendarStep onComplete={() => completeStep(1)} />
    },
    {
      id: "portfolio",
      title: "Adicione seu portfólio",
      description: "Mostre seus melhores trabalhos aos clientes",
      icon: <Image className="h-5 w-5 text-green-600" />,
      points: 25,
      completed: false,
      component: <PortfolioStep onComplete={() => completeStep(2)} />
    },
    {
      id: "pricing",
      title: "Configure seus preços",
      description: "Defina quanto você cobra por seus serviços",
      icon: <CreditCard className="h-5 w-5 text-amber-600" />,
      points: 15,
      completed: false,
      component: <PricingStep onComplete={() => completeStep(3)} />
    },
    {
      id: "verification",
      title: "Verifique sua conta",
      description: "Receba o selo de profissional verificado",
      icon: <Shield className="h-5 w-5 text-red-600" />,
      points: 25,
      completed: false,
      component: <VerificationStep onComplete={() => completeStep(4)} />
    }
  ]);
  
  const totalPoints = steps.reduce((acc, step) => acc + step.points, 0);
  const earnedPoints = steps.reduce((acc, step) => acc + (step.completed ? step.points : 0), 0);
  const progress = Math.round((earnedPoints / totalPoints) * 100);
  
  const completeStep = (index: number) => {
    const updatedSteps = [...steps];
    updatedSteps[index].completed = true;
    setSteps(updatedSteps);
    
    // Move to next incomplete step if available
    const nextIncompleteIndex = updatedSteps.findIndex((step, i) => i > index && !step.completed);
    if (nextIncompleteIndex !== -1) {
      setCurrentStep(nextIncompleteIndex);
    }
  };
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Progress header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium flex items-center">
            <Award className="h-5 w-5 text-purple-600 mr-2" />
            Complete seu perfil e ganhe pontos
          </h3>
          <Badge 
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0"
          >
            <Star className="h-3.5 w-3.5 mr-1 fill-white text-white" />
            {earnedPoints} pontos
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progresso</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center"
          >
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <CheckCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">Parabéns! Perfil completo</p>
              <p className="text-sm text-green-700">
                Você ganhou 5 indicações gratuitas e um selo verificado
              </p>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Steps indicators */}
      <div className="p-4 flex overflow-x-auto gap-2 border-b">
        {steps.map((step, index) => (
          <button
            key={step.id}
            className={`
              flex-1 min-w-24 py-2 px-3 rounded-lg flex flex-col items-center text-center transition-all
              ${currentStep === index 
                ? 'bg-purple-50 border border-purple-200' 
                : 'hover:bg-gray-50'}
              ${step.completed && 'bg-green-50 border border-green-200'}
            `}
            onClick={() => setCurrentStep(index)}
          >
            <div className={`
              rounded-full h-8 w-8 flex items-center justify-center mb-1
              ${currentStep === index && !step.completed ? 'bg-purple-100' : ''}
              ${step.completed ? 'bg-green-100' : 'bg-gray-100'}
            `}>
              {step.completed 
                ? <CheckCircle className="h-5 w-5 text-green-600" />
                : step.icon
              }
            </div>
            <p className="text-xs font-medium">{step.title}</p>
          </button>
        ))}
      </div>
      
      {/* Current step content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {steps[currentStep].component}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 0}
          >
            Anterior
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={currentStep === steps.length - 1}
          >
            Próximo
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Step components
const ProfileStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-lg">Informações básicas</h4>
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <Camera className="h-8 w-8 text-gray-400" />
          </div>
          <Button 
            size="sm" 
            className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Adicione uma foto profissional para aumentar suas chances de match
        </p>
        
        <div className="w-full space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Nome completo</label>
            <input 
              type="text" 
              className="w-full border rounded-md px-3 py-2" 
              placeholder="Ex: João Silva"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Título profissional</label>
            <input 
              type="text" 
              className="w-full border rounded-md px-3 py-2" 
              placeholder="Ex: Desenvolvedor Full Stack"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Biografia</label>
            <textarea 
              className="w-full border rounded-md px-3 py-2 h-20" 
              placeholder="Conte um pouco sobre você e sua experiência..."
            />
          </div>
        </div>
      </div>
      
      <Button 
        onClick={onComplete} 
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        Salvar perfil
        <Zap className="h-4 w-4 ml-1" />
      </Button>
      
      <div className="flex items-center justify-center gap-2">
        <Badge 
          variant="outline" 
          className="bg-purple-50 border-purple-200"
        >
          <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
          <span className="text-purple-700">+20 pontos</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className="bg-green-50 border-green-200"
        >
          <Users className="h-3.5 w-3.5 mr-1 text-green-600" />
          <span className="text-green-700">+30% matches</span>
        </Badge>
      </div>
    </div>
  );
};

const CalendarStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-lg">Configure sua disponibilidade</h4>
      <p className="text-sm text-gray-500">
        Defina seus horários disponíveis para receber agendamentos
      </p>
      
      <div className="space-y-3">
        {["Segunda", "Terça", "Quarta", "Quinta", "Sexta"].map(day => (
          <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{day}</p>
            </div>
            <div className="flex gap-2">
              <select className="border rounded px-2 py-1 text-sm">
                <option>08:00</option>
                <option>09:00</option>
                <option>10:00</option>
              </select>
              <span className="self-center">às</span>
              <select className="border rounded px-2 py-1 text-sm">
                <option>17:00</option>
                <option>18:00</option>
                <option>19:00</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        onClick={onComplete} 
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        Salvar disponibilidade
        <Clock className="h-4 w-4 ml-1" />
      </Button>
      
      <div className="flex items-center justify-center gap-2">
        <Badge 
          variant="outline" 
          className="bg-purple-50 border-purple-200"
        >
          <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
          <span className="text-purple-700">+15 pontos</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className="bg-blue-50 border-blue-200"
        >
          <Calendar className="h-3.5 w-3.5 mr-1 text-blue-600" />
          <span className="text-blue-700">+50% visibilidade</span>
        </Badge>
      </div>
    </div>
  );
};

const PortfolioStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-lg">Adicione seu portfólio</h4>
      <p className="text-sm text-gray-500">
        Mostre seus melhores trabalhos para atrair mais clientes
      </p>
      
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div 
            key={item} 
            className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300"
          >
            <Image className="h-6 w-6 text-gray-400" />
          </div>
        ))}
      </div>
      
      <div className="pt-2">
        <Button 
          variant="outline" 
          className="w-full border-dashed"
        >
          <Image className="h-4 w-4 mr-2" />
          Adicionar imagens
        </Button>
      </div>
      
      <Button 
        onClick={onComplete} 
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        Salvar portfólio
        <BadgeCheck className="h-4 w-4 ml-1" />
      </Button>
      
      <div className="flex items-center justify-center gap-2">
        <Badge 
          variant="outline" 
          className="bg-purple-50 border-purple-200"
        >
          <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
          <span className="text-purple-700">+25 pontos</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className="bg-green-50 border-green-200"
        >
          <Users className="h-3.5 w-3.5 mr-1 text-green-600" />
          <span className="text-green-700">+40% mais clientes</span>
        </Badge>
      </div>
    </div>
  );
};

const PricingStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-lg">Configure seus preços</h4>
      <p className="text-sm text-gray-500">
        Defina quanto você cobra por seus serviços
      </p>
      
      <div className="space-y-3">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h5 className="font-medium">Preço base</h5>
            <div className="flex items-center">
              <span className="mr-2 text-sm">R$</span>
              <input 
                type="number" 
                className="w-24 border rounded px-3 py-1" 
                defaultValue="180"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Este é seu preço padrão por hora de serviço
          </p>
        </div>
        
        <div className="border rounded-lg p-4">
          <h5 className="font-medium mb-4">Preços dinâmicos</h5>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Horário de pico</p>
                <p className="text-xs text-gray-500">Seg-Sex, 18h-21h</p>
              </div>
              <div className="flex items-center">
                <span className="mr-1 text-sm">+</span>
                <input 
                  type="number" 
                  className="w-16 border rounded px-3 py-1" 
                  defaultValue="15"
                />
                <span className="ml-1 text-sm">%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Horário de baixa</p>
                <p className="text-xs text-gray-500">Seg-Sex, 9h-11h</p>
              </div>
              <div className="flex items-center">
                <span className="mr-1 text-sm">-</span>
                <input 
                  type="number" 
                  className="w-16 border rounded px-3 py-1" 
                  defaultValue="10"
                />
                <span className="ml-1 text-sm">%</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Agendamento urgente</p>
                <p className="text-xs text-gray-500">Menos de 24h</p>
              </div>
              <div className="flex items-center">
                <span className="mr-1 text-sm">+</span>
                <input 
                  type="number" 
                  className="w-16 border rounded px-3 py-1" 
                  defaultValue="20"
                />
                <span className="ml-1 text-sm">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={onComplete} 
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        Salvar preços
        <DollarSign className="h-4 w-4 ml-1" />
      </Button>
      
      <div className="flex items-center justify-center gap-2">
        <Badge 
          variant="outline" 
          className="bg-purple-50 border-purple-200"
        >
          <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
          <span className="text-purple-700">+15 pontos</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className="bg-amber-50 border-amber-200"
        >
          <DollarSign className="h-3.5 w-3.5 mr-1 text-amber-600" />
          <span className="text-amber-700">+25% receita</span>
        </Badge>
      </div>
    </div>
  );
};

const VerificationStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-lg">Verifique sua conta</h4>
      <p className="text-sm text-gray-500">
        Adicione verificações para ganhar a confiança dos clientes
      </p>
      
      <div className="space-y-3">
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-start">
            <div className="bg-white rounded-full p-2 mr-3">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h5 className="font-medium">Documento de identidade</h5>
              <p className="text-sm text-gray-500 mt-1">
                Envie uma foto do seu documento para verificação
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-3"
              >
                <Camera className="h-3.5 w-3.5 mr-1" />
                Enviar documento
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-start">
            <div className="bg-white rounded-full p-2 mr-3">
              <MapPin className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h5 className="font-medium">Endereço profissional</h5>
              <p className="text-sm text-gray-500 mt-1">
                Confirme seu endereço para aparecer no mapa 3D
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-3"
              >
                <MapPin className="h-3.5 w-3.5 mr-1" />
                Confirmar endereço
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-start">
            <div className="bg-white rounded-full p-2 mr-3">
              <BadgeCheck className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h5 className="font-medium">Certificações profissionais</h5>
              <p className="text-sm text-gray-500 mt-1">
                Adicione seus diplomas e certificados para aumentar sua credibilidade
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-3"
              >
                <Award className="h-3.5 w-3.5 mr-1" />
                Adicionar certificados
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={onComplete} 
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        Completar verificação
        <Shield className="h-4 w-4 ml-1" />
      </Button>
      
      <div className="flex items-center justify-center gap-2">
        <Badge 
          variant="outline" 
          className="bg-purple-50 border-purple-200"
        >
          <Star className="h-3.5 w-3.5 mr-1 text-yellow-500" />
          <span className="text-purple-700">+25 pontos</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className="bg-blue-50 border-blue-200"
        >
          <Shield className="h-3.5 w-3.5 mr-1 text-blue-600" />
          <span className="text-blue-700">Selo verificado</span>
        </Badge>
      </div>
    </div>
  );
};

export default GamifiedOnboarding;
