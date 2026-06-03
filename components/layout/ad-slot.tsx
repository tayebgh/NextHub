// components/layout/ad-slot.tsx
"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  slot: string;
  format?: "horizontal" | "rectangle" | "vertical";
  className?: string;
}

export function AdSlot({ slot, format = "horizontal", className }: AdSlotProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (adsenseId) {
      try {
       // @ts-expect-error
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    }
  }, []);

  if (!adsenseId) {
    // Placeholder in development
    return (
      <div
        className={cn(
          "adsense-slot",
          format === "horizontal" && "h-[90px]",
          format === "rectangle" && "h-[250px] max-w-[300px]",
          format === "vertical" && "h-[600px] max-w-[160px]",
          className
        )}
      >
        <span className="text-xs text-muted-foreground">
          Ad slot: {slot}
        </span>
      </div>
    );
  }

  const formatMap = {
    horizontal: "leaderboard",
    rectangle: "rectangle",
    vertical: "vertical",
  };

  return (
    <div className={cn("adsense-slot", className)}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={formatMap[format]}
        data-full-width-responsive="true"
      />
    </div>
  );
}
