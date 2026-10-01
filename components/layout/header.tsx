"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { PreferenceControls } from "@/components/layout/preference-controls";
import { Button, buttonStyles } from "@/components/ui/button";
import { useMockSession } from "@/features/auth/mock-session";
import { useSavedSearches } from "@/features/saved-searches/saved-searches-context";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import { Localized } from "@/components/ui/localized";

const roleCopy: Record<UserRole, { badge: string; description: string; demo: string }> = {
  user: {
    badge: "Buyer",
    description: "Search listings across Europe and contact Disposal Partners directly.",
    demo: "Use this profile to demo the buyer journey."
  },
  partner: {
    badge: "Disposal Partner",
    description: "Import and manage your listings, mark items as sold and read buyer inquiries.",
    demo: "Use this profile to demo the seller journey."
  },
  admin: {
    badge: "Admin",
    description: "Open the back office: all listings, buyer messages and partner registrations.",
    demo: "Use this profile to demo the Bridgeon back office."
  }
};

export function Header() {
  const { currentUser, users, loginAs, logout } = useMockSession();
  const { searches, totalNew } = useSavedSearches();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function handleOpenLogin() {
      setIsLoginOpen(true);
    }

    window.addEventListener("open-mock-login", handleOpenLogin);

    return () => {
      window.removeEventListener("open-mock-login", handleOpenLogin);
    };
  }, []);

  const navItems = [
    { href: "/", label: "Overview", active: pathname === "/" },
    {
      href: "/listings",
      label: "Listings",
      active: pathname.startsWith("/listings"),
    },
    { href: "/buyers", label: "For buyers", active: pathname.startsWith("/buyers") },
    { href: "/sell", label: "Sell with us", active: pathname.startsWith("/sell") },
    ...(searches.length > 0 ? [{ href: "/saved", label: "Saved", active: pathname.startsWith("/saved") }] : []),
  ];

  return (
    <Localized>
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl">
        <div className="shell flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
          <Logo />
          {/* Mobile: logo + account on the first row, navigation on its own row below. */}
          <nav aria-label="Main" className="order-3 flex w-full flex-wrap items-center gap-1.5 text-sm text-muted lg:order-2 lg:w-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  aria-current={item.active ? "page" : undefined}
                  href={item.href}
                  className={cn(
                    "rounded-[1.1rem] px-4 py-2.5 no-underline transition duration-200",
                    item.active
                      ? "bg-surface-low text-primary tonal-rule"
                      : "hover:bg-surface-low/80 hover:text-primary",
                  )}
                >
                  {item.label}
                  {item.href === "/saved" && totalNew > 0 ? (
                    <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-primary">
                      {totalNew}
                      <span className="sr-only"> new match{totalNew === 1 ? "" : "es"}</span>
                    </span>
                  ) : null}
                </Link>
              ))}
              {currentUser?.role === "admin" ? (
                <Link
                  aria-current={pathname.startsWith("/admin") ? "page" : undefined}
                  href="/admin"
                  className={cn(
                    "rounded-[1.1rem] px-4 py-2.5 no-underline transition duration-200",
                    pathname.startsWith("/admin")
                      ? "bg-surface-low text-primary tonal-rule"
                      : "hover:bg-surface-low/80 hover:text-primary",
                  )}
                >
                  Admin
                </Link>
              ) : null}
              {currentUser?.role === "partner" ? (
                <Link
                  aria-current={pathname.startsWith("/partner") ? "page" : undefined}
                  href="/partner"
                  className={cn(
                    "rounded-[1.1rem] px-4 py-2.5 no-underline transition duration-200",
                    pathname.startsWith("/partner")
                      ? "bg-surface-low text-primary tonal-rule"
                      : "hover:bg-surface-low/80 hover:text-primary",
                  )}
                >
                  My listings
                </Link>
              ) : null}
          </nav>

          {currentUser ? (
            <div className="order-2 ml-auto flex items-center gap-1.5 sm:gap-2 lg:order-3">
              <PreferenceControls />
              <div className="hidden rounded-[1.35rem] bg-surface-low px-4 py-3 text-sm tonal-rule md:block">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-ink">
                    {currentUser.company}
                  </span>
                  <span className="text-muted">/</span>
                  <span className="text-muted">{currentUser.name}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className={buttonStyles(
                  "secondary",
                  "px-4 py-2.5 text-xs whitespace-nowrap",
                )}
              >
                Switch
              </button>
              <button
                type="button"
                onClick={logout}
                className={buttonStyles(
                  "ghost",
                  "px-4 py-2.5 text-xs whitespace-nowrap",
                )}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="order-2 ml-auto flex items-center gap-1.5 sm:gap-2 lg:order-3">
              <PreferenceControls />
              <Button onClick={() => setIsLoginOpen(true)} className="px-5 py-2.5">
                Login
              </Button>
            </div>
          )}
        </div>
      </header>

      {isLoginOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8 md:items-center">
          <button
            type="button"
            aria-label="Close login modal"
            className="absolute inset-0 bg-[rgba(10,26,47,0.36)] backdrop-blur-sm"
            onClick={() => setIsLoginOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mock-login-title"
            className="relative z-10 w-full max-w-5xl rounded-[2rem] bg-surface-lowest p-8 shadow-[0_32px_90px_rgba(7,25,50,0.22)] tonal-rule"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="eyebrow">Demo sign in</p>
                <h2 id="mock-login-title" className="subsection-title mt-3">
                  Choose a demo profile
                </h2>
                <p className="support-copy mt-3 max-w-2xl">
                  Demo login only — no real account is created. Switch between
                  the buyer, Disposal Partner and admin profiles to present each journey.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLoginOpen(false)}
                className={buttonStyles("ghost", "px-4")}
              >
                Close
              </button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    loginAs(user.id);
                    setIsLoginOpen(false);
                  }}
                  className="group rounded-[1.75rem] bg-surface-low p-6 text-left tonal-rule transition duration-200 hover:-translate-y-0.5 hover:bg-surface-bright"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold",
                        user.role === "admin" && "bg-surface-high text-primary",
                        user.role === "partner" && "bg-accent text-primary",
                        user.role === "user" && "bg-primary text-white"
                      )}
                    >
                      {roleCopy[user.role].badge}
                    </span>
                    <span className="text-sm font-medium text-muted group-hover:text-primary">
                      Sign in
                    </span>
                  </div>
                  <p className="mt-5 font-display text-2xl font-semibold tracking-[-0.03em] text-ink">
                    {user.name}
                  </p>
                  <p className="mt-2 text-sm text-muted">{user.company}</p>
                  <p className="mt-6 text-sm leading-6 text-muted">{roleCopy[user.role].description}</p>
                  <div className="mt-6 rounded-[1.35rem] bg-surface-lowest/80 px-4 py-4 text-sm text-muted tonal-rule">
                    {roleCopy[user.role].demo}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Localized>
  );
}
