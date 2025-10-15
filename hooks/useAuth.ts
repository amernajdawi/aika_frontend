import { useState, useEffect } from 'react';
import { User, StoredUser, AuthState, LoginCredentials, LoginResponse } from '../types/auth';

// Hardcoded users as requested
const USERS: User[] = [
  { username: 'Amernaj', password: 'Amer&1234', displayName: 'Amernaj' },
  { username: 'Florian plakolb', password: 'Florian&1234', displayName: 'Florian Plakolb' },
  { username: 'Michaela plakolb', password: 'Michaela&1234', displayName: 'Michaela Plakolb' },
  { username: 'test1', password: 'test1&1234', displayName: 'Test User 1' },
];

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('aika_user');
        if (savedUser) {
          const user: StoredUser = JSON.parse(savedUser);
          setAuthState({
            isAuthenticated: true,
            user,
            isLoading: false,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));


      const user = USERS.find(
        u => u.username === credentials.username && u.password === credentials.password
      );

      if (user) {
        // Store user in localStorage (excluding password for security)
        const userToStore: StoredUser = {
          username: user.username,
          displayName: user.displayName,
        };
        
        localStorage.setItem('aika_user', JSON.stringify(userToStore));
        
        setAuthState({
          isAuthenticated: true,
          user: userToStore,
          isLoading: false,
        });

        return {
          success: true,
          user: userToStore,
        };
      } else {
        return {
          success: false,
          message: 'Invalid username or password',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login',
      };
    }
  };

  const logout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('aika_user');
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
      // Force a page refresh to ensure the login page is shown
      window.location.reload();
    }
  };

  return {
    ...authState,
    login,
    logout,
  };
}
