import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  username: string;
  role: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { username: string; password: string }) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing auth on mount
    const savedAuth = localStorage.getItem('gbv-auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        // Verify the auth data is still valid (you might want to add expiration logic)
        if (authData.user && authData.timestamp) {
          const hoursSinceLogin = (Date.now() - authData.timestamp) / (1000 * 60 * 60);
          // Auto-logout after 24 hours
          if (hoursSinceLogin < 24) {
            setUser(authData.user);
          } else {
            localStorage.removeItem('gbv-auth');
          }
        }
      } catch (error) {
        localStorage.removeItem('gbv-auth');
      }
    }
  }, []);

  const login = (credentials: { username: string; password: string }): boolean => {
    // Demo validation - in real app this would be API call
    if (credentials.username === "responder" && credentials.password === "gbv2023") {
      const userData: User = {
        username: credentials.username,
        role: "Senior Responder",
        lastLogin: new Date().toISOString()
      };
      
      setUser(userData);
      
      // Save to localStorage with timestamp
      const authData = {
        user: userData,
        timestamp: Date.now()
      };
      localStorage.setItem('gbv-auth', JSON.stringify(authData));
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gbv-auth');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};