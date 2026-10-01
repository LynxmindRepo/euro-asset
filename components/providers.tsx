"use client";

import { MockSessionProvider } from "@/features/auth/mock-session";
import { MarketplaceProvider } from "@/features/marketplace/marketplace-store";
import { ToastProvider } from "@/components/feedback/toast-provider";
import { CurrencyProvider } from "@/features/preferences/currency-context";
import { UnitsProvider } from "@/features/preferences/units-context";
import { SavedSearchesProvider } from "@/features/saved-searches/saved-searches-context";
import { LanguageProvider } from "@/features/preferences/language-context";
import { FavouritesProvider } from "@/features/favourites/favourites-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
    <MockSessionProvider>
      <MarketplaceProvider>
        <CurrencyProvider>
          <UnitsProvider>
            <ToastProvider>
              <SavedSearchesProvider>
                <FavouritesProvider>{children}</FavouritesProvider>
              </SavedSearchesProvider>
            </ToastProvider>
          </UnitsProvider>
        </CurrencyProvider>
      </MarketplaceProvider>
    </MockSessionProvider>
    </LanguageProvider>
  );
}
