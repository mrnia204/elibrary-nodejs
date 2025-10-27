import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'admin' | 'student';

interface User {
  username: string;
  role: UserRole;
  user_id: string;
  activity_id: string;
  login_time: string;
}

interface AuthContextType {
  user: User | null;
  login: ( userData: User ) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  },[])

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{user, login, logout, isAuthenticated}}>
      {children}
    </AuthContext.Provider>
  )
};



// useAuth

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error ('useAuth must be used within an AuthProvider');
  }

  return context;
}


