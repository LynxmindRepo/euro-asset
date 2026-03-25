"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { mockUsers } from "@/data/users";
import { User } from "@/types";

type MockSessionContextValue = {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  loginAs: (userId: string) => void;
  logout: () => void;
};

const MockSessionContext = createContext<MockSessionContextValue | null>(null);

export function MockSessionProvider({ children }: { children: React.ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const value = useMemo(() => {
    const currentUser =
      mockUsers.find((user) => user.id === currentUserId) ?? null;

    return {
      currentUser,
      users: mockUsers,
      isAuthenticated: currentUser !== null,
      loginAs: setCurrentUserId,
      logout: () => setCurrentUserId(null)
    };
  }, [currentUserId]);

  return <MockSessionContext.Provider value={value}>{children}</MockSessionContext.Provider>;
}

export function useMockSession() {
  const context = useContext(MockSessionContext);

  if (!context) {
    throw new Error("useMockSession must be used within MockSessionProvider");
  }

  return context;
}
