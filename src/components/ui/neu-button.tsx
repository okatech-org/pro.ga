import * as React from "react";
import { cn } from "@/lib/utils";

export interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "admin" | "citizen" | "outline" | "premium" | "success";
  size?: "sm" | "md" | "lg";
}

const NeuButton = React.forwardRef<HTMLButtonElement, NeuButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variantClasses = {
      default: "neu-button",
      admin: "neu-button-admin",
      citizen: "neu-button-citizen",
      outline: "neu-button-outline",
      premium: "neu-button-premium",
      success: "neu-button-success",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(variantClasses[variant], sizeClasses[size], className)}
        {...props}
      />
    );
  }
);
NeuButton.displayName = "NeuButton";

export { NeuButton };

