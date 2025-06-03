
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessagesSquare, UserCircle, Mail, Clock, Send, Edit2 } from 'lucide-react';
import { MOCK_ADMIN_SUPPORT_MESSAGES, MOCK_USERS } from '@/lib/mock-data';
import type { AdminSupportMessage, AdminSupportMessageStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';

export default function AdminSupportMessagesPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<AdminSupportMessage[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // Stores message ID being replied to
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    // Sort by newest first
    const sortedMessages = [...MOCK_ADMIN_SUPPORT_MESSAGES].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setMessages(sortedMessages);
  }, []);

  const handleStatusChange = (messageId: string, newStatus: AdminSupportMessageStatus) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, status: newStatus } : msg
      )
    );
    toast({ title: "Status Updated", description: `Message ${messageId} status changed to ${newStatus}.` });
  };

  const handleStartReply = (messageId: string) => {
    setReplyingTo(messageId);
    setReplyContent(''); // Clear previous reply content
  };

  const handleSendReply = (messageId: string) => {
    if (replyContent.trim() === '') {
      toast({ title: "Reply Empty", description: "Cannot send an empty reply.", variant: "destructive" });
      return;
    }
    // In a real app, this would send the reply to the backend
    console.log(`Replying to message ${messageId}: ${replyContent}`);
    toast({ title: "Reply Sent (Mock)", description: `Your reply to message ${messageId} has been 'sent'.` });
    
    // Update status to 'Replied' and clear reply state
    handleStatusChange(messageId, 'Replied');
    setReplyingTo(null);
    setReplyContent('');
  };

  const getStatusColor = (status: AdminSupportMessageStatus) => {
    switch (status) {
      case 'New': return 'bg-blue-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Replied': return 'bg-green-500';
      case 'Resolved': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center">
            <MessagesSquare className="h-7 w-7 mr-2 text-primary" /> Customer Support Messages
          </CardTitle>
          <CardDescription>View and manage incoming customer inquiries from the chat widget or direct contact.</CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">No support messages found.</p>
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <Card key={msg.id} className="bg-card-foreground/5">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-1">{msg.subject}</CardTitle>
                        <div className="flex items-center text-xs text-muted-foreground space-x-3">
                          <span className="flex items-center"><UserCircle className="w-3.5 h-3.5 mr-1" />{msg.userName}</span>
                          <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1" />{msg.userEmail}</span>
                          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" />{formatDistanceToNow(msg.timestamp, { addSuffix: true })}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant="secondary" className={`text-xs ${getStatusColor(msg.status)} text-white`}>
                          {msg.status}
                        </Badge>
                         <Select
                            value={msg.status}
                            onValueChange={(value) => handleStatusChange(msg.id, value as AdminSupportMessageStatus)}
                          >
                            <SelectTrigger className="w-[130px] h-8 text-xs">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              {(['New', 'In Progress', 'Replied', 'Resolved'] as AdminSupportMessageStatus[]).map(s => (
                                <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{msg.messageContent}</p>
                  </CardContent>
                  <CardFooter className="pt-3 flex flex-col items-stretch">
                    {replyingTo === msg.id ? (
                      <div className="w-full space-y-2">
                        <Textarea
                          placeholder={`Replying to ${msg.userName}...`}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={3}
                          className="text-sm"
                        />
                        <div className="flex justify-end space-x-2">
                           <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                           <Button size="sm" onClick={() => handleSendReply(msg.id)}>
                            <Send className="w-3.5 h-3.5 mr-1.5" />Send Reply
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleStartReply(msg.id)} className="self-start">
                        <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Reply
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
