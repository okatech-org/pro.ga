import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { NeuIconPill } from "./neu-icon-pill";

export interface NeuStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: "primary" | "success" | "warning" | "info" | "danger";
}

const NeuStatCard = React.forwardRef<HTMLDivElement, NeuStatCardProps>(
  ({ className, title, value, subtitle, icon, iconColor = "primary", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("neu-card p-6", className)}
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">
              {title}
            </p>
            <p className="text-4xl font-bold text-foreground mb-1">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
          <NeuIconPill icon={icon} color={iconColor} size="md" />
        </div>
      </div>
    );
  }
);
NeuStatCard.displayName = "NeuStatCard";

export { NeuStatCard };

