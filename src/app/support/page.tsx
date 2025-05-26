"use client";

import { useState, useRef, useEffect } from 'react';
import MainLayout from '@/components/layout/main-layout';
import ChatMessage from '@/components/chat/chat-message';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send, MessageSquare, CornerDownLeft } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { aiChatSupport, type AiChatSupportInput, type AiChatSupportOutput } from '@/ai/flows/ai-chat-support';

export default function SupportChatPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'initial-ai',
      text: "Hello! How can I help you with your motorbike rental today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    setInputValue('');
    setIsLoading(true);

    try {
      const input: AiChatSupportInput = { query: userMessage.text };
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
        id: `error-${Date.now()}`,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl h-[calc(100vh-12rem)] flex flex-col"> {/* Adjust height as needed */}
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary flex items-center">
              <MessageSquare className="w-8 h-8 mr-3" /> AI Chat Support
            </CardTitle>
            <CardDescription>
              Ask our AI assistant anything about motorbike rentals. For complex issues, we can connect you to staff.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto p-4 space-y-2 bg-card-foreground/5 rounded-md">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="p-4 border-t">
            <div className="flex w-full items-start space-x-2">
              <Textarea
                placeholder="Type your message here..."
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
