"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Localized } from "@/components/ui/localized";

type ToastTone = "info" | "success" | "error";

type Toast = {
  id: string;
  tone: ToastTone;
  text: string;
};

type ToastContextValue = {
  pushToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const pushToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.round(Math.random() * 1000)}`;
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 6000);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Live region so screen readers announce every toast (WCAG 4.1.3). */}
      <Localized><div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-50 grid w-[min(360px,calc(100vw-2rem))] gap-3"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "rounded-2xl px-4 py-4 text-sm shadow-ambient backdrop-blur-md tonal-rule",
              toast.tone === "info" && "bg-surface-bright/95 text-ink",
              toast.tone === "success" && "bg-success/95 text-success-ink",
              toast.tone === "error" && "bg-danger/95 text-danger-ink"
            )}
          >
            {toast.text}
          </div>
        ))}
      </div></Localized>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
