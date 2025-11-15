import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface NeuIconPillProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  color?: "primary" | "success" | "warning" | "info" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
}

const colorClasses = {
  primary: "text-secondary",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
  danger: "text-destructive",
};

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-20 h-20",
};

const iconSizeClasses = {
  sm: "w-5 h-5",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-10 h-10",
};

const NeuIconPill = React.forwardRef<HTMLDivElement, NeuIconPillProps>(
  ({ className, icon: Icon, color = "primary", size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "icon-pill flex-shrink-0",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        {...props}
      >
        <Icon className={iconSizeClasses[size]} />
      </div>
    );
  }
);
NeuIconPill.displayName = "NeuIconPill";

export { NeuIconPill };

