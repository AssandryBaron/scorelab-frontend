import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User { 
  id: string | number;
  name: string;
  email: string;
  role?: 'admin' | 'user';
  avatar?: string;
  familiaId?: number | null;
}

// CORRECCIÓN: Agregamos export para que sea visible en toda la app
export interface AuthContextType {  
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean; 
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8080/api/usuarios/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const usuarioReal = await response.json();
        setUser(usuarioReal);
        return true;
      }
      return false;
    } catch (error) {
      console.error("No se pudo conectar con Java:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null); 
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>  
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { 
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Usuarios mock para demo (mantener para otras partes de la app si se requiere)
const MOCK_USERS: User[] = [
  { id: '1', name: 'Ana García', email: 'admin@casa.com', role: 'admin' },
  { id: '2', name: 'Carlos Rodríguez', email: 'carlos@casa.com', role: 'user' },
];

export function useUsers() {
  return MOCK_USERS;
}