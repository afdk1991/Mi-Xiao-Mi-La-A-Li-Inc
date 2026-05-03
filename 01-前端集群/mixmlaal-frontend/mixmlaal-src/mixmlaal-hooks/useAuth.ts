import { useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });
  const [loginType, setLoginType] = useState<string>(() => {
    return localStorage.getItem('loginType') || '';
  });

  const login = (userData: User, token: string, type: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('loginType', type);
    setUser(userData);
    setIsAuthenticated(true);
    setLoginType(type);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('loginType');
      setUser(null);
      setIsAuthenticated(false);
      setLoginType('');
    }
  };

  return { user, isAuthenticated, loginType, login, logout };
};

export const useCart = () => {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const count = data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
          setCartCount(count);
        }
      }
    } catch {
    }
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  return { cartCount, updateCartCount };
};
