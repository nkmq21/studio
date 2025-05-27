
"use client";

import { useState, useRef, useEffect } from 'react';
import MainLayout from '@/components/layout/main-layout';
import ChatMessage from '@/components/chat/chat-message';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Send, MessageSquare, CornerDownLeft, Bot, Users } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { aiChatSupport, type AiChatSupportInput, type AiChatSupportOutput } from '@/ai/flows/ai-chat-support';

type ChatMode = 'ai' | 'staff';

export default function SupportChatPage() {
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
      // Simulate staff interaction
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      const staffThinkingMessage: ChatMessageType = {
        id: `staff-typing-${Date.now()}`,
        text: "Connecting you to staff support...",
        sender: 'system', // Using 'system' for this intermediate message
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, staffThinkingMessage]);
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate staff response time

      // Remove "Connecting..." message before adding actual staff reply (optional)
      setMessages(prevMsgs => prevMsgs.filter(msg => msg.id !== staffThinkingMessage.id));

      const staffResponseMessage: ChatMessageType = {
        id: `staff-response-${Date.now()}`,
        text: "Hello! This is MotoRent Staff Support. How can I help you today?",
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

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl h-[calc(100vh-12rem)] flex flex-col">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary flex items-center">
              <MessageSquare className="w-8 h-8 mr-3" /> MotoRent Support
            </CardTitle>
            <CardDescription>
              Chat with our AI assistant or connect with a staff member for help with your motorbike rentals.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-4 space-y-2 bg-card-foreground/5 rounded-md">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="p-4 border-t flex flex-col items-stretch">
            <Tabs defaultValue="ai" value={chatMode} onValueChange={handleModeChange} className="w-full mb-3">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai" disabled={isLoading}><Bot className="mr-2 h-4 w-4" />Chat with AI</TabsTrigger>
                <TabsTrigger value="staff" disabled={isLoading}><Users className="mr-2 h-4 w-4" />Chat with Staff</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex w-full items-start space-x-2">
              <Textarea
                placeholder={chatMode === 'ai' ? "Ask the AI assistant..." : "Type your message to staff..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="flex-grow resize-none min-h-[40px] focus-visible:ring-1 focus-visible:ring-primary"
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || inputValue.trim() === ''} size="icon" className="h-10 w-10 shrink-0">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                <span className="sr-only">Send message</span>
              </Button>
            </div>
             <p className="text-xs text-muted-foreground w-full text-center mt-1.5">
                Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"><CornerDownLeft size={12}/></kbd> to send. Shift+Enter for new line.
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
