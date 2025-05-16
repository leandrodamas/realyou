
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

export const useChat = () => {
  const [inCall, setInCall] = useState(false);
  const [callWith, setCallWith] = useState("");
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Start video call
  const startCall = (name: string) => {
    setCallWith(name);
    setInCall(true);
    toast.success(`Chamada de vídeo iniciada com ${name}`);
  };

  // End video call
  const endCall = () => {
    toast.info(`Chamada encerrada com ${callWith}`);
    setInCall(false);
    setCallWith("");
  };

  // Toggle video in call
  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    toast(`Vídeo ${!videoEnabled ? 'ativado' : 'desativado'}`);
  };

  // Toggle audio in call
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    toast(`Microfone ${!audioEnabled ? 'ativado' : 'desativado'}`);
  };

  // Open chat with user
  const openChat = (id: string, name: string) => {
    setSelectedChat(id);
    setChatOpen(true);
    // We'll use the name from the selected chat in the list
    setCallWith(name);
  };

  // Simulate a call after 5 seconds when the page is loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!inCall && !chatOpen) {
        startCall("Maria Silva");
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return {
    inCall,
    callWith,
    videoEnabled,
    audioEnabled,
    selectedChat,
    chatOpen,
    startCall,
    endCall,
    toggleVideo,
    toggleAudio,
    openChat,
    setChatOpen,
  };
};
