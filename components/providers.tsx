"use client";

import { MockSessionProvider } from "@/features/auth/mock-session";
import { MarketplaceProvider } from "@/features/marketplace/marketplace-store";
import { ToastProvider } from "@/components/feedback/toast-provider";
import { CurrencyProvider } from "@/features/preferences/currency-context";
import { UnitsProvider } from "@/features/preferences/units-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MockSessionProvider>
      <MarketplaceProvider>
        <CurrencyProvider>
          <UnitsProvider>
            <ToastProvider>{children}</ToastProvider>
          </UnitsProvider>
        </CurrencyProvider>
      </MarketplaceProvider>
    </MockSessionProvider>
  );
}
