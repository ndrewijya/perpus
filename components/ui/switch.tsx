"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <label
    className={cn(
      "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-input transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary",
      className
    )}
    data-checked={props.checked ? true : undefined}
  >
    <input type="checkbox" ref={ref} className="sr-only" {...props} />
    <span
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
        props.checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </label>
));
Switch.displayName = "Switch";

export { Switch };
