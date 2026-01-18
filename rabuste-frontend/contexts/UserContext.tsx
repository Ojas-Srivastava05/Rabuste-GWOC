"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/store/cartStore";

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
  isVerified?: boolean;
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

  const checkAuth = useCallback(async () => {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Check if API URL is configured
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.warn("NEXT_PUBLIC_API_URL is not configured");
        setIsLoading(false);
        return;
      }

      // Verify token with backend - add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        const res = await fetch(`${apiUrl}/api/protected/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token invalid, clear it
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        // Handle abort (timeout) or other fetch errors
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.warn("Auth check timed out - backend may be slow or unavailable");
          // Don't clear token on timeout - backend might just be slow
        } else {
          throw fetchError; // Re-throw to be caught by outer catch
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Don't remove token on network errors - backend might be temporarily down
      // Only clear on actual auth failures
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (!errorMessage.includes("Failed to fetch") && 
          !errorMessage.includes("NetworkError") &&
          !errorMessage.includes("aborted")) {
        localStorage.removeItem("token");
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
    
    // Clear cart data on logout
    localStorage.removeItem("cart");
    
    // Clear Zustand cart store in memory
    useCartStore.getState().clearCart();
    
    // Clear user-specific favorites (optional - you might want to keep them)
    // If you want to clear favorites on logout, uncomment the next line:
    // if (user?.id) localStorage.removeItem(`favorites_${user.id}`);
    
    // Clear user state
    setUser(null);
    
    // Close welcome popup if open
    setShowWelcomePopup(false);
    
    // Redirect to home page
    router.push("/");
  }

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