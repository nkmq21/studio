
"use client";

import { useState, useRef, useEffect } from 'react';
import ChatMessage from '@/components/chat/chat-message';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Send, MessageSquare, CornerDownLeft, Bot, Users, X } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { aiChatSupport, type AiChatSupportInput, type AiChatSupportOutput } from '@/ai/flows/ai-chat-support';

type ChatMode = 'ai' | 'staff';

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'initial-ai',
      text: "Hello! How can I help you with your motorbike rental today? You can also switch to chat with Staff Support using the tabs above the input.",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('ai');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Reset to initial message if widget is closed and reopened, or mode changes significantly
    if (isOpen && messages.length <= 1 && messages[0]?.id !== 'initial-ai') {
        setMessages([
            {
              id: 'initial-ai',
              text: "Hello! How can I help you with your motorbike rental today? You can also switch to chat with Staff Support using the tabs above the input.",
              sender: 'ai',
              timestamp: new Date(),
            }
          ]);
    }
  }, [isOpen]);


  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    if (chatMode === 'ai') {
      try {
        const input: AiChatSupportInput = { query: currentInput };
        const result: AiChatSupportOutput = await aiChatSupport(input);
        
        const aiMessage: ChatMessageType = {
          id: `ai-${Date.now()}`,
          text: result.answer || "I'm sorry, I couldn't process that. Please try rephrasing.",
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error fetching AI response:", error);
        const errorMessage: ChatMessageType = {
          id: `error-ai-${Date.now()}`,
          text: "Sorry, I'm having trouble connecting to the AI assistant right now. Please try again later or switch to Staff Support.",
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } else { // chatMode === 'staff'
      await new Promise(resolve => setTimeout(resolve, 500)); 
      const staffThinkingMessage: ChatMessageType = {
        id: `staff-typing-${Date.now()}`,
        text: "Connecting you to staff support...",
        sender: 'system',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, staffThinkingMessage]);
      
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      setMessages(prevMsgs => prevMsgs.filter(msg => msg.id !== staffThinkingMessage.id));

      const staffResponseMessage: ChatMessageType = {
        id: `staff-response-${Date.now()}`,
        text: "Hello! This is MotoRent Staff Support. A real person will be with you shortly. In the meantime, please describe your issue.",
        sender: 'staff',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, staffResponseMessage]);
    }
    setIsLoading(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleModeChange = (newMode: string) => {
    const mode = newMode as ChatMode;
    setChatMode(mode);
    const systemMessage: ChatMessageType = {
      id: `system-switch-${Date.now()}`,
      text: `Switched to ${mode === 'ai' ? 'AI Assistant' : 'Staff Support'}.`,
      sender: 'system',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 md:w-96 h-[500px] md:h-[600px] z-50 flex flex-col shadow-2xl rounded-lg border border-border/60">
      <CardHeader className="flex flex-row items-center justify-between p-3 border-b bg-card">
        <div className="flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            <CardTitle className="text-lg font-semibold">Support Chat</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
          <X className="h-4 w-4" />
          <span className="sr-only">Close chat</span>
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-3 space-y-1.5 bg-background/70">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="p-3 border-t bg-card flex flex-col items-stretch">
        <Tabs defaultValue="ai" value={chatMode} onValueChange={handleModeChange} className="w-full mb-2.5">
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="ai" disabled={isLoading} className="text-xs px-2 py-1.5"><Bot className="mr-1.5 h-3.5 w-3.5" />AI</TabsTrigger>
            <TabsTrigger value="staff" disabled={isLoading} className="text-xs px-2 py-1.5"><Users className="mr-1.5 h-3.5 w-3.5" />Staff</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex w-full items-start space-x-2">
          <Textarea
            placeholder={chatMode === 'ai' ? "Ask AI..." : "Message staff..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="flex-grow resize-none min-h-[38px] text-sm focus-visible:ring-1 focus-visible:ring-primary"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || inputValue.trim() === ''} size="icon" className="h-9 w-9 shrink-0">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
         <p className="text-xs text-muted-foreground w-full text-center mt-1">
            <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-0.5 rounded border bg-muted px-1 font-mono text-[9px] font-medium text-muted-foreground opacity-100"><CornerDownLeft size={10}/></kbd> to send.
        </p>
      </CardFooter>
    </Card>
  );
}
