// components/ui/toaster.tsx
"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// Simple toast context
interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "info";
}

const ToastContext = React.createContext<{
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export function useToast() {
  return React.useContext(ToastContext);
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            className={cn(
              "group pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl border p-4 shadow-lg transition-all",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out",
              "data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-5",
              toast.variant === "success" &&
                "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800",
              toast.variant === "error" &&
                "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800",
              toast.variant === "info" &&
                "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800",
              (!toast.variant || toast.variant === "default") &&
                "bg-card border-border"
            )}
          >
            {toast.variant === "success" && (
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            )}
            {toast.variant === "error" && (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            )}
            {toast.variant === "info" && (
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <ToastPrimitive.Title className="text-sm font-semibold">
                {toast.title}
              </ToastPrimitive.Title>
              {toast.description && (
                <ToastPrimitive.Description className="text-xs text-muted-foreground mt-0.5">
                  {toast.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
