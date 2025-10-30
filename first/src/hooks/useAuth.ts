'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

interface User {
  username: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, []);

  // реєстрація
  const register = async (username: string, password: string) => {
    await api.post('/auth/register', { username, password });
  };

  // логін
  const login = async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password });
    const token = res.data.token;

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username }));
      setUser({ username });
      router.replace('/tasks'); // після логіну йдемо на /tasks
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.replace('/auth/login');
  };

  return { user, register, login, logout };
};
