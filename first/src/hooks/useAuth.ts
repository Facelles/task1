'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

interface User {
  username: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password });
    const token = res.data.token;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username }));
      setUser({ username });
      router.replace('/tasks');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.replace('/auth/login');
  };

  const register = async (username: string, password: string) => {
    await api.post('/auth/register', { username, password });
  };

  return { user, loading, login, logout, register };
};
