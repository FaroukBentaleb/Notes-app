// src/context/user-context.tsx
"use client";
import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: number;
  email: string;
  username: string;
};

const UserContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}>({
  user: null,
  setUser: () => {},
  loading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const userCookie = getCookie('currentUser');
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie));
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user cookie', error);
        document.cookie = 'currentUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);