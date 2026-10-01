"use client";

import { MockSessionProvider } from "@/features/auth/mock-session";
import { MarketplaceProvider } from "@/features/marketplace/marketplace-store";
import { ToastProvider } from "@/components/feedback/toast-provider";
import { CurrencyProvider } from "@/features/preferences/currency-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MockSessionProvider>
      <MarketplaceProvider>
        <CurrencyProvider>
          <ToastProvider>{children}</ToastProvider>
        </CurrencyProvider>
      </MarketplaceProvider>
    </MockSessionProvider>
  );
}
