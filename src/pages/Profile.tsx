
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, UserCircle2, X } from 'lucide-react';
import Header from '@/components/Header';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [status, setStatus] = useState(user?.status || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const handleSave = () => {
    updateProfile({
      displayName,
      status,
      avatar
    });
    
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated",
    });
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

  const updateAvatar = () => {
    // In a real app, this would open a file picker
    // For demo purposes, we'll just generate a new avatar
    const randomId = Math.floor(Math.random() * 1000);
    setAvatar(`https://avatar.vercel.sh/${randomId}`);
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col animate-fade-in">
      <Header
        title="Profile"
        showBackButton
      />

      <div className="flex-1 container max-w-2xl py-8 px-4">
        <div className="mb-8 text-center relative">
          <div className="relative inline-block">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-background">
              <AvatarImage src={avatar} alt={displayName} />
              <AvatarFallback className="text-xl">{getInitials(displayName || user.username)}</AvatarFallback>
            </Avatar>
            
            {isEditing && (
              <button 
                onClick={updateAvatar}
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {!isEditing ? (
            <>
              <h1 className="text-2xl font-bold">{displayName || user.username}</h1>
              {status && <p className="text-muted-foreground">{status}</p>}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Click the camera icon to change your avatar
            </p>
          )}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  {isEditing 
                    ? "Edit your profile information" 
                    : "Your profile information visible to others"}
                </CardDescription>
              </div>
              
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              {isEditing ? (
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                />
              ) : (
                <div className="p-2 bg-muted/50 rounded-md">
                  {displayName || user.username}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="p-2 bg-muted/50 rounded-md">
                {user.username}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <Textarea
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="What's on your mind?"
                  className="max-h-24"
                />
              ) : (
                <div className="p-2 bg-muted/50 rounded-md min-h-[40px]">
                  {status || "No status set"}
                </div>
              )}
            </div>
          </CardContent>
          
          {isEditing && (
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Theme & Appearance</CardTitle>
            <CardDescription>
              Customize how the application looks
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
              <div>
                {/* Theme toggle is already in the Header */}
                <p className="text-sm text-muted-foreground">
                  Use the toggle in the header
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Actions that cannot be undone
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
