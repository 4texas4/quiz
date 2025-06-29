"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function StarRating({ value, onChange, className }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          aria-label={`Rate ${star} out of 5 stars`}
        >
          <Star
            className={cn(
              "w-8 h-8 transition-colors",
              (hoverValue || value) >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground/50"
            )}
          />
        </button>
      ))}
    </div>
  );
}
