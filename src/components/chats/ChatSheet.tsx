
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Send, Paperclip, Image, MapPin, Mic } from "lucide-react";
import { toast } from "sonner";

interface ChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatWith: string;
  onStartCall: (name: string) => void;
}

const ChatSheet: React.FC<ChatSheetProps> = ({
  open,
  onOpenChange,
  chatWith,
  onStartCall,
}) => {
  const [message, setMessage] = useState("");
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [attachmentType, setAttachmentType] = useState<string | null>(null);
  
  const audioTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const audioRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  const sendMessage = () => {
    if (message.trim()) {
      toast.success(`Mensagem enviada para ${chatWith}`);
      setMessage("");
    }
  };

  // Start recording audio message
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.start();
      setIsRecordingAudio(true);
      
      // Start timer
      setAudioTime(0);
      audioTimerRef.current = setInterval(() => {
        setAudioTime(prev => prev + 1);
      }, 1000);
      
      toast("Gravando mensagem de voz...");
    } catch (error) {
      toast.error("Erro ao acessar microfone");
      console.error("Error accessing microphone:", error);
    }
  };
  
  // Stop recording audio message
  const stopAudioRecording = () => {
    if (audioRecorderRef.current && isRecordingAudio) {
      audioRecorderRef.current.stop();
      
      audioRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Here you would typically send the audio blob to your backend
        // For demo purposes, we'll just show a toast
        toast.success(`Mensagem de voz de ${audioTime}s enviada para ${chatWith}`);
      };
      
      // Stop all tracks in the stream
      audioRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      
      // Clear timer
      if (audioTimerRef.current) {
        clearInterval(audioTimerRef.current);
      }
      
      setIsRecordingAudio(false);
      setAudioTime(0);
    }
  };

  // Handle attachment selection
  const handleAttachment = (type: string) => {
    setAttachmentType(type);
    
    // For demo purposes, we'll just show a toast
    toast.success(`Seleção de ${type} aberta`);
    
    // In a real app, here you would open a file picker or camera
    // For demo, we'll just simulate it closing after a second
    setTimeout(() => {
      setAttachmentType(null);
      toast(`${type} enviado para ${chatWith}`);
    }, 1000);
  };

  // Send location
  const shareLocation = () => {
    if (navigator.geolocation) {
      toast("Obtendo sua localização...");
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          toast.success(`Localização enviada para ${chatWith}: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          toast.error("Erro ao obter localização");
          console.error("Error getting location:", error);
        }
      );
    } else {
      toast.error("Geolocalização não suportada pelo seu navegador");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="border-b p-4 bg-white sticky top-0 z-10">
          <SheetTitle className="text-left flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => onStartCall(chatWith)}
            >
              <Video className="h-4 w-4" />
            </Button>
            <span>{chatWith}</span>
          </SheetTitle>
        </SheetHeader>

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
              <p>Olá, como vai?</p>
              <span className="text-xs text-gray-500">10:30 AM</span>
            </div>

            <div className="bg-blue-100 p-3 rounded-lg max-w-[80%] ml-auto">
              <p>Estou bem! E você?</p>
              <span className="text-xs text-gray-500">10:31 AM</span>
            </div>

            <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
              <p>Podemos marcar uma reunião amanhã?</p>
              <span className="text-xs text-gray-500">10:32 AM</span>
            </div>

            <div className="bg-blue-100 p-3 rounded-lg max-w-[80%] ml-auto">
              <p>Claro! Que horas é melhor para você?</p>
              <span className="text-xs text-gray-500">10:33 AM</span>
            </div>
          </div>
        </div>

        {/* Message input area */}
        <div className="border-t p-3 bg-white sticky bottom-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleAttachment('arquivo')}
              className="text-gray-500"
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleAttachment('mídia')}
              className="text-gray-500"
            >
              <Image className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={shareLocation}
              className="text-gray-500"
            >
              <MapPin className="h-5 w-5" />
            </Button>

            <Input
              className="flex-1"
              placeholder="Digite uma mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />

            {message ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={sendMessage}
                className="text-blue-500"
              >
                <Send className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-500"
                onMouseDown={startAudioRecording}
                onMouseUp={stopAudioRecording}
                onTouchStart={startAudioRecording}
                onTouchEnd={stopAudioRecording}
              >
                <Mic className={`h-5 w-5 ${isRecordingAudio ? "text-red-500 animate-pulse" : ""}`} />
                {isRecordingAudio && <span className="absolute -top-8 bg-gray-800 text-white px-2 py-1 rounded text-xs">{audioTime}s</span>}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSheet;
