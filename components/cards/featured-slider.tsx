// components/cards/featured-slider.tsx
"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WebsiteCard } from "@/components/cards/website-card";
import type { Website } from "@/types";

interface FeaturedSliderProps {
  websites: Website[];
}

export function FeaturedSlider({ websites }: FeaturedSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4 touch-pan-y">
          {websites.map((website) => (
            <div
              key={website.id}
              className="flex-none w-[280px] sm:w-[300px]"
            >
              <WebsiteCard website={website} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors"
        aria-label="Previous"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors"
        aria-label="Next"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Gradient fades */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
}
