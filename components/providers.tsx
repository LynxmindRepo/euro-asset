"use client";

import { MockSessionProvider } from "@/features/auth/mock-session";
import { MarketplaceProvider } from "@/features/cart/marketplace-store";
import { ToastProvider } from "@/components/feedback/toast-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MockSessionProvider>
      <MarketplaceProvider>
        <ToastProvider>{children}</ToastProvider>
      </MarketplaceProvider>
    </MockSessionProvider>
  );
}
