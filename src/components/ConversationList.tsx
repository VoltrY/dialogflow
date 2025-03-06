
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
    sender?: string;
    isRead: boolean;
  };
  isGroup?: boolean;
  status?: 'online' | 'offline' | 'away';
  unreadCount?: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({ 
  conversations,
  activeConversationId
}) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const formatTime = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="space-y-1 px-2">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-muted",
            activeConversationId === conversation.id && "bg-muted",
          )}
          onClick={() => navigate(`/chat/${conversation.id}`)}
        >
          <div className="relative">
            <Avatar>
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
              <AvatarFallback>{getInitials(conversation.name)}</AvatarFallback>
            </Avatar>
            {conversation.status && (
              <span 
                className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                  conversation.status === 'online' ? 'bg-green-500' : 
                  conversation.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                )}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline">
              <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
              {conversation.lastMessage && (
                <span className="text-xs text-muted-foreground">
                  {formatTime(conversation.lastMessage.timestamp)}
                </span>
              )}
            </div>
            {conversation.lastMessage && (
              <div className="flex justify-between items-center">
                <p className={cn(
                  "text-xs truncate",
                  conversation.lastMessage.isRead ? "text-muted-foreground" : "font-medium"
                )}>
                  {conversation.lastMessage.sender && `${conversation.lastMessage.sender}: `}
                  {conversation.lastMessage.content}
                </p>
                {conversation.unreadCount && conversation.unreadCount > 0 && (
                  <span className="w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-xs rounded-full">
                    {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
