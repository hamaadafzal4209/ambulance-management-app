"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

type User = {
  id: string;
  name: string;
  phoneNumber: string;
  role: "user" | "driver" | "hospital" | "police";
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (
    phoneNumber: string,
    password: string,
    role: User["role"]
  ) => Promise<void>;
  signUp: (
    name: string,
    phoneNumber: string,
    password: string,
    role: User["role"]
  ) => Promise<void>;
  signOut: () => Promise<void>;
  guestSignIn: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  guestSignIn: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          setUser(JSON.parse(userString));
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (
    phoneNumber: string,
    password: string,
    role: User["role"]
  ) => {
    setIsLoading(true);
    try {
      const mockUser: User = {
        id: "123",
        name: "John Doe",
        phoneNumber,
        role,
      };

      await AsyncStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);

      router.replace(`/${role}/dashboard`);
    } catch (error) {
      console.error("Sign in failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    name: string,
    phoneNumber: string,
    password: string,
    role: User["role"]
  ) => {
    setIsLoading(true);
    try {
      const mockUser: User = {
        id: "123",
        name,
        phoneNumber,
        role,
      };

      await AsyncStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);

      // Navigate to the appropriate dashboard based on role
      router.replace(`/${role}/dashboard`);
    } catch (error) {
      console.error("Sign up failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
      router.replace("/");
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const guestSignIn = async () => {
    setIsLoading(true);
    try {
      const guestUser: User = {
        id: "guest",
        name: "Guest User",
        phoneNumber: "guest",
        role: "user",
      };

      await AsyncStorage.setItem("user", JSON.stringify(guestUser));
      setUser(guestUser);

      router.replace("/user/dashboard");
    } catch (error) {
      console.error("Guest sign in failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signUp, signOut, guestSignIn }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
