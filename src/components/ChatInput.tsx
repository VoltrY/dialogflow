
import React, { useState } from 'react';
import { Mic, Paperclip, Send, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendAudio?: () => void;
  onAttach?: () => void;
}

const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '👍', '👎', '❤️', '👏', '🙏', '🤝', '💪', '🤔', '🤨', '😐'
];

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage,
  onSendAudio,
  onAttach
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (onSendAudio) {
      onSendAudio();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-center gap-2 p-3 border-t bg-background"
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="icon" className="rounded-full flex-shrink-0">
            <Smile className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="grid grid-cols-5 gap-2">
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiSelect(emoji)}
                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-muted rounded-md transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Button 
        type="button" 
        variant="ghost" 
        size="icon" 
        className="rounded-full flex-shrink-0"
        onClick={onAttach}
      >
        <Paperclip className="h-5 w-5" />
      </Button>

      <div className="relative flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          className="w-full resize-none rounded-xl py-2 px-4 max-h-20 focus:outline-none focus:ring-1 focus:ring-primary bg-muted/50"
          rows={1}
        />
      </div>

      {message.trim() ? (
        <Button type="submit" size="icon" className="rounded-full bg-primary flex-shrink-0">
          <Send className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          type="button"
          variant={isRecording ? "destructive" : "default"}
          size="icon"
          className={cn("rounded-full flex-shrink-0", isRecording && "animate-pulse")}
          onClick={toggleRecording}
        >
          <Mic className="h-5 w-5" />
        </Button>
      )}
    </form>
  );
};

export default ChatInput;
