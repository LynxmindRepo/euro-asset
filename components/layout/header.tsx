"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Button, buttonStyles } from "@/components/ui/button";
import { useMockSession } from "@/features/auth/mock-session";
import { useMarketplace } from "@/features/cart/marketplace-store";
import { cn } from "@/lib/utils";

export function Header() {
  const { currentUser, users, loginAs, logout } = useMockSession();
  const { cartItems } = useMarketplace();
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
      href: "/auctions",
      label: "Processes",
      active: pathname.startsWith("/auctions"),
    },
    {
      href: "/cart",
      label: "Dossier",
      active: pathname.startsWith("/cart") || pathname.startsWith("/checkout"),
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl">
        <div className="shell flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-6">
            <Logo />
            <nav className="hidden items-center gap-1.5 text-sm text-muted lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-[1.1rem] px-4 py-2.5 no-underline transition duration-200",
                    item.active
                      ? "bg-surface-low text-primary tonal-rule"
                      : "hover:bg-surface-low/80 hover:text-primary",
                  )}
                >
                  {item.label}
                  {item.href === "/cart" && cartItems.length > 0
                    ? ` (${cartItems.length})`
                    : ""}
                </Link>
              ))}
              {currentUser?.role === "admin" ? (
                <Link
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
            </nav>
          </div>

          {currentUser ? (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <div className="rounded-[1.35rem] bg-surface-low px-4 py-3 text-sm tonal-rule">
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
            <div className="flex items-center gap-3">
              <Button onClick={() => setIsLoginOpen(true)}>Login</Button>
            </div>
          )}
        </div>
      </header>

      {isLoginOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
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
            className="relative z-10 w-full max-w-3xl rounded-[2rem] bg-surface-lowest p-8 shadow-[0_32px_90px_rgba(7,25,50,0.22)] tonal-rule"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="institutional-kicker">Mock sign in</p>
                <h2 id="mock-login-title" className="subsection-title mt-3">
                  Enter the platform with a demo profile.
                </h2>
                <p className="support-copy mt-3 max-w-2xl">
                  This login flow is intentionally local to the prototype and
                  lets you present the buyer and admin journeys without a live
                  authentication backend.
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

            <div className="mt-8 grid gap-4 md:grid-cols-2">
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
                      className={
                        user.role === "admin"
                          ? "rounded-full bg-tertiary px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-tertiary-ink"
                          : "rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                      }
                    >
                      {user.role === "admin" ? "Admin" : "Buyer"}
                    </span>
                    <span className="text-xs uppercase tracking-[0.16em] text-muted group-hover:text-primary">
                      Sign in
                    </span>
                  </div>
                  <p className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em] text-ink">
                    {user.name}
                  </p>
                  <p className="mt-2 text-sm text-muted">{user.company}</p>
                  <p className="mt-6 text-sm leading-6 text-muted">
                    {user.role === "admin"
                      ? "Access the operational dashboard, create new process records, and review session activity."
                      : "Review live processes, stage a proposal dossier, and continue through formal submission."}
                  </p>
                  <div className="mt-6 rounded-[1.35rem] bg-surface-lowest/80 px-4 py-4 text-sm text-muted tonal-rule">
                    {user.role === "admin"
                      ? "Use this route to demonstrate curation, intake, and dashboard oversight."
                      : "Use this route to demonstrate search, process review, and formal proposal delivery."}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
