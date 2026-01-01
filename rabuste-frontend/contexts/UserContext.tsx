"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: {
    countryCode: string;
    number: string;
    fullNumber: string;
  };
  role: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  showWelcomePopup: boolean;
  setShowWelcomePopup: (show: boolean) => void;
  login: (token: string, userData: User, fromDirectLogin?: boolean) => void;
  logout: () => void;
  updateUser: (userData: User) => void;
  checkAuth: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Verify token with backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/protected/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Token invalid, clear it
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string, userData: User, fromDirectLogin = false) => {
    localStorage.setItem("token", token);
    setUser(userData);
    
    // Show welcome popup only if login is from direct path (path 1)
    if (fromDirectLogin) {
      setShowWelcomePopup(true);
    }
  };

  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    
    // Optional: Clear cart data on logout
    localStorage.removeItem("cart");
    
    // Clear user state
    setUser(null);
    
    // Close welcome popup if open
    setShowWelcomePopup(false);
    
    // Redirect to home page
    router.push("/");
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        showWelcomePopup,
        setShowWelcomePopup,
        login,
        logout,
        updateUser,
        checkAuth,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}