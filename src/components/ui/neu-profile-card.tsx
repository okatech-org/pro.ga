import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { NeuIconPill } from "./neu-icon-pill";

export interface NeuProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle: string;
  description: string;
  attributions: string[];
  icon: LucideIcon;
  iconColor?: "primary" | "success" | "warning" | "info" | "danger";
}

const NeuProfileCard = React.forwardRef<HTMLDivElement, NeuProfileCardProps>(
  ({ className, title, subtitle, description, attributions, icon, iconColor = "primary", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("neu-card p-6 space-y-4", className)}
        {...props}
      >
        <div className="flex items-start gap-4">
          <NeuIconPill icon={icon} color={iconColor} size="lg" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1">
              {title}
            </h3>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {subtitle}
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-foreground mb-3">
            Attributions principales
          </h4>
          <ul className="space-y-2">
            {attributions.map((attribution, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-1 flex-shrink-0">•</span>
                <span>{attribution}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
);
NeuProfileCard.displayName = "NeuProfileCard";

export { NeuProfileCard };

