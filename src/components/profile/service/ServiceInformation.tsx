import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  Award, 
  Star, 
  TrendingUp, 
  Package, 
  ThumbsUp,
  Users,
  Shield
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const ServiceInformation: React.FC = () => {
  const [showReviews, setShowReviews] = useState(false);
  
  // Mock review data
  const reviews = [
    { name: "Marcela S.", rating: 5, comment: "Excelente profissional! Super recomendo.", date: "há 2 dias" },
    { name: "João P.", rating: 4, comment: "Ótimo serviço, pontual e eficiente.", date: "há 1 semana" },
    { name: "Ana C.", rating: 5, comment: "Incrível! Resolveu meu problema rapidamente.", date: "há 3 semanas" },
  ];
  
  // Rating statistics
  const ratingStats = {
    "5": 87,
    "4": 10,
    "3": 2,
    "2": 1,
    "1": 0,
  };
  
  const toggleReviews = () => setShowReviews(!showReviews);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Informações do Serviço</span>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            4.9
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start">
            <Award className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium">Consultoria de Software</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                <p className="text-xs text-gray-500">Superstar • Escolha da Semana</p>
                <Badge variant="outline" className="text-[10px] border-purple-200 bg-purple-50 text-purple-700">
                  <ThumbsUp className="h-2.5 w-2.5 mr-0.5" />
                  98% de aprovação
                </Badge>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-purple-600 mr-3" />
            <div>
              <h4 className="font-medium">Duração</h4>
              <p className="text-gray-600">1 hora</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-600 mr-3" />
            <div className="w-full">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Valor</h4>
                <Badge className="bg-amber-100 text-amber-700 border-0">
                  <TrendingUp className="h-3 w-3 mr-1" /> 
                  Preço Dinâmico
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-600 font-medium">R$ 150,00 ~ 180,00</p>
                <Badge className="bg-blue-100 text-blue-700 border-0">Preço acessível</Badge>
              </div>
              
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Horário vazio</span>
                  <span>Horário cheio</span>
                </div>
                <div className="h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full mt-1"></div>
              </div>
              
              <div className="mt-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Package className="h-3 w-3 mr-1" />
                      Ver pacotes com desconto
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Pacotes Promocionais</DialogTitle>
                      <DialogDescription>
                        Economize adquirindo um pacote de sessões
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 my-2">
                      <div className="border rounded-md p-3 bg-purple-50 border-purple-200">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Pacote 3 + 1</h4>
                          <Badge className="bg-green-100 text-green-700">Economia de 25%</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">3 sessões + 1 sessão gratuita</p>
                        <div className="flex justify-between mt-2 text-sm">
                          <span className="font-medium">Total: R$ 540,00</span>
                          <span className="text-purple-600">R$ 180 por sessão</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Pacote Mensal</h4>
                          <Badge className="bg-amber-100 text-amber-700">Mais popular</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">5 sessões (uma por semana)</p>
                        <div className="flex justify-between mt-2 text-sm">
                          <span className="font-medium">Total: R$ 800,00</span>
                          <span className="text-purple-600">R$ 160 por sessão</span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button>Fechar</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <h4 className="font-medium">Local</h4>
              <p className="text-gray-600">Online (via chamada de vídeo)</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-start">
            <Users className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium">Avaliações</h4>
              <div className="flex items-center mt-1 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-sm ml-2">4.9 (132 avaliações)</span>
              </div>
              
              {!showReviews ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-purple-600 -ml-2" 
                  onClick={toggleReviews}
                >
                  Ver avaliações
                </Button>
              ) : (
                <div className="animate-fade-in">
                  <div className="space-y-1 mb-2">
                    {Object.entries(ratingStats).map(([rating, percentage]) => (
                      <div key={rating} className="flex items-center gap-2">
                        <div className="w-4 text-xs text-right">{rating}</div>
                        <Progress value={percentage} className="h-1.5" />
                        <div className="text-xs text-gray-500 w-6">{percentage}%</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 mt-3">
                    {reviews.map((review, index) => (
                      <div key={index} className="border-t pt-2 border-gray-100">
                        <div className="flex justify-between">
                          <span className="font-medium text-sm">{review.name}</span>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex mt-0.5 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`h-2.5 w-2.5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-purple-600 -ml-2 mt-2" 
                    onClick={toggleReviews}
                  >
                    Esconder avaliações
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-2 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-2">
              <Shield className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm font-medium">RealYou Garantia</span>
            </div>
            <p className="text-sm text-gray-600">
              Consultoria personalizada para desenvolvimento de software, arquitetura de sistemas e resolução de problemas técnicos. Satisfação garantida ou seu dinheiro de volta.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceInformation;
