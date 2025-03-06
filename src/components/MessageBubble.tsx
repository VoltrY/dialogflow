
import React from 'react';
import { Check, CheckCheck, File, Mic, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type MessageType = 'text' | 'image' | 'file' | 'audio';

export interface MessageProps {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  isOutgoing: boolean;
  timestamp: Date;
  status?: MessageStatus;
  type?: MessageType;
  duration?: number; // For audio messages (in seconds)
}

const MessageBubble: React.FC<MessageProps> = ({
  content,
  isOutgoing,
  timestamp,
  status = 'sent',
  type = 'text',
  duration,
}) => {
  const statusIcon = () => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 rounded-full bg-foreground/30 animate-pulse" />;
      case 'sent':
        return <Check className="h-3 w-3 text-foreground/70" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-foreground/70" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'failed':
        return <div className="w-3 h-3 rounded-full bg-destructive" />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const renderContent = () => {
    switch (type) {
      case 'image':
        return (
          <div className="rounded-lg overflow-hidden mb-1">
            <div className="bg-muted/30 p-6 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-foreground/50" />
            </div>
            <p className="mt-1 text-sm">{content}</p>
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center gap-2">
            <div className="bg-background/20 p-2 rounded-md">
              <File className="w-5 h-5" />
            </div>
            <span>{content}</span>
          </div>
        );
      case 'audio':
        return (
          <div className="flex items-center gap-2">
            <div className="bg-background/20 p-2 rounded-md">
              <Mic className="w-5 h-5" />
            </div>
            <div className="flex-1 h-1 bg-background/20 rounded-full" />
            <span className="text-xs">{duration ? formatDuration(duration) : '0:00'}</span>
          </div>
        );
      default:
        return content;
    }
  };

  return (
    <div className={cn("flex flex-col", isOutgoing ? "items-end" : "items-start")}>
      <div 
        className={cn(
          isOutgoing ? "chat-bubble-outgoing" : "chat-bubble-incoming",
          "animate-fade-in"
        )}
      >
        {renderContent()}
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground px-1">
        <span>{formatTime(timestamp)}</span>
        {isOutgoing && statusIcon()}
      </div>
    </div>
  );
};

export default MessageBubble;
