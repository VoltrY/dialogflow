import React, { createContext, useState, useContext, useEffect } from 'react';

// Define user type
interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  status?: string;
}

// Define authentication context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  updateProfile: () => {},
});

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function with specific credential check
  const login = async (username: string, password: string) => {
    // Special case for "enes enesdemirezen"
    if (username === "enes" && password === "enesdemirezen") {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create user for Enes
      const enesUser: User = {
        id: '1001',
        username: 'enes',
        displayName: 'Enes Demirezen',
        avatar: `https://avatar.vercel.sh/enes`,
        status: 'Available',
      };
      
      setUser(enesUser);
      localStorage.setItem('user', JSON.stringify(enesUser));
      return;
    }
    
    // Existing mock login functionality for other users
    if (username && password) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create mock user
      const newUser: User = {
        id: '1',
        username,
        displayName: username,
        avatar: `https://avatar.vercel.sh/${username}`,
        status: 'Available',
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return;
    }
    
    throw new Error('Invalid credentials');
  };

  // Mock logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Update user profile
  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
