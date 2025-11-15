import * as React from "react";

import { cn } from "@/lib/utils";

export interface NeuInputProps extends React.ComponentProps<"input"> {}

const Input = React.forwardRef<HTMLInputElement, NeuInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full neu-input text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
