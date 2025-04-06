import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from '@/components/ui/use-toast';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Mock user database for demo purposes
const mockUsers: Record<string, { id: string; email: string; name: string; password: string; role: 'admin' | 'user' }> = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    password: 'admin123',
    role: 'admin'
  },
  'user@example.com': {
    id: '2',
    email: 'user@example.com',
    name: 'Demo User',
    password: 'user123',
    role: 'user'
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const lowercaseEmail = email.toLowerCase();
          const user = mockUsers[lowercaseEmail];
          
          if (!user || user.password !== password) {
            throw new Error('Invalid email or password');
          }
          
          // Omit password from the stored user object
          const { password: _, ...safeUser } = user;
          
          set({
            user: safeUser,
            isAuthenticated: true,
            isLoading: false
          });
          
          toast({
            title: "Login successful",
            description: `Welcome back, ${safeUser.name}!`,
            variant: "success",
          });
          
          // Store authentication in localStorage for persistence
          localStorage.setItem('user', JSON.stringify(safeUser));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
          
          toast({
            title: "Login failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        }
      },
      
      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const lowercaseEmail = email.toLowerCase();
          
          // Check if user already exists
          if (mockUsers[lowercaseEmail]) {
            throw new Error('Email already in use');
          }
          
          // Create new user
          const newUser = {
            id: `${Object.keys(mockUsers).length + 1}`,
            email: lowercaseEmail,
            name,
            password,
            role: 'user' as const
          };
          
          // Add to mock database
          mockUsers[lowercaseEmail] = newUser;
          
          // Omit password from the stored user object
          const { password: _, ...safeUser } = newUser;
          
          set({
            user: safeUser,
            isAuthenticated: true,
            isLoading: false
          });
          
          toast({
            title: "Registration successful",
            description: `Welcome to MCPCloudTools, ${safeUser.name}!`,
            variant: "success",
          });
          
          // Store authentication in localStorage
          localStorage.setItem('user', JSON.stringify(safeUser));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false
          });
          
          toast({
            title: "Registration error",
            description: "An unexpected error occurred. Please try again later.",
            variant: "destructive",
          });
        }
      },
      
      logout: () => {
        // Clear user from localStorage
        localStorage.removeItem('user');
        set({
          user: null,
          isAuthenticated: false,
          error: null
        });
        
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
          variant: "default",
        });
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

// Initialization function to restore auth state from localStorage
export function initializeAuthStore() {
  const storedUser = localStorage.getItem('user');
  
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      useAuthStore.setState({ 
        isAuthenticated: true, 
        user 
      });
    } catch (error) {
      localStorage.removeItem('user');
    }
  }
} 