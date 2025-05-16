
import React from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ChatList from "@/components/chats/ChatList";
import ChatsHeader from "@/components/chats/ChatsHeader";
import VideoCallDialog from "@/components/chats/VideoCallDialog";
import ChatSheet from "@/components/chats/ChatSheet";
import { useChat } from "@/components/chats/useChat";

const ChatsPage: React.FC = () => {
  const {
    inCall,
    callWith,
    videoEnabled,
    audioEnabled,
    chatOpen,
    setChatOpen,
    startCall,
    endCall,
    toggleVideo,
    toggleAudio,
    openChat,
  } = useChat();

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen">
        <ChatsHeader />

        {/* Chat List */}
        <div className="bg-white">
          <ChatList onChatSelect={(id, name) => openChat(id, name)} />
        </div>

        {/* Video Call Dialog */}
        <VideoCallDialog 
          inCall={inCall}
          callWith={callWith}
          videoEnabled={videoEnabled}
          audioEnabled={audioEnabled}
          onEndCall={endCall}
          onVideoToggle={toggleVideo}
          onAudioToggle={toggleAudio}
        />

        {/* Chat Sheet */}
        <ChatSheet 
          open={chatOpen}
          onOpenChange={setChatOpen}
          chatWith={callWith}
          onStartCall={startCall}
        />
      </div>
    </ProtectedRoute>
  );
};

export default ChatsPage;
