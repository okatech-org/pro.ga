import * as React from "react";
import { cn } from "@/lib/utils";

export interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "admin" | "citizen" | "outline" | "premium" | "success";
}

const NeuButton = React.forwardRef<HTMLButtonElement, NeuButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "neu-button",
      admin: "neu-button-admin",
      citizen: "neu-button-citizen",
      outline: "neu-button-outline",
      premium: "neu-button-premium",
      success: "neu-button-success",
    };

    return (
      <button
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      />
    );
  }
);
NeuButton.displayName = "NeuButton";

export { NeuButton };

