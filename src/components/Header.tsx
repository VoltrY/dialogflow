
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, MoreVertical, Phone, Video } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  showActions?: boolean;
  onBack?: () => void;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  showActions = false,
  onBack,
  avatar,
  status,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="glass glass-dark sticky top-0 z-10 border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Go back">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {avatar && (
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage src={avatar} alt={title || "User"} />
              <AvatarFallback>{title ? getInitials(title) : "U"}</AvatarFallback>
            </Avatar>
            {status && (
              <span 
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                  status === 'online' ? 'bg-green-500' : 
                  status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}
              />
            )}
          </div>
        )}

        <div className="flex flex-col justify-center">
          {title && <h1 className="font-medium text-base">{title}</h1>}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {showActions && (
          <>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Voice call">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Video call">
              <Video className="h-5 w-5" />
            </Button>
          </>
        )}

        <ThemeToggle />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Menu">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48" align="end">
            <div className="flex flex-col space-y-1">
              <Button 
                variant="ghost" 
                className="justify-start"
                onClick={() => navigate('/profile')}
              >
                Profile
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start text-destructive"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
