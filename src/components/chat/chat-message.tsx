import type { ChatMessage as ChatMessageType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, ShieldCheck } from 'lucide-react'; // ShieldCheck for staff

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';
  const isStaff = message.sender === 'staff';

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className={cn(
      "flex items-end space-x-3 py-3",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          {/* Placeholder for AI/Staff avatar if available */}
          {/* <AvatarImage src={isAI ? "/ai-avatar.png" : "/staff-avatar.png"} /> */}
          <AvatarFallback className={cn(
            "text-sm",
            isAI && "bg-primary text-primary-foreground",
            isStaff && "bg-green-500 text-white" 
          )}>
            {isAI ? <Bot size={18} /> : isStaff ? <ShieldCheck size={18} /> : '?'}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn(
        "max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow",
        isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card text-card-foreground rounded-bl-none"
      )}>
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <p className={cn(
          "text-xs mt-1",
          isUser ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          {/* Placeholder for user avatar if available */}
          {/* <AvatarImage src="/user-avatar.png" /> */}
          <AvatarFallback className="bg-accent text-accent-foreground text-sm">
            <User size={18} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
