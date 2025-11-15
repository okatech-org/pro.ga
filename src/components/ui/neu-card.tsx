import * as React from "react";
import { cn } from "@/lib/utils";

export interface NeuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "sm" | "inset" | "raised";
}

const NeuCard = React.forwardRef<HTMLDivElement, NeuCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "neu-card",
      sm: "neu-card-sm",
      inset: "neu-inset",
      raised: "neu-raised",
    };

    return (
      <div
        ref={ref}
        className={cn(variantClasses[variant], "p-6", className)}
        {...props}
      />
    );
  }
);
NeuCard.displayName = "NeuCard";

const NeuCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
));
NeuCardHeader.displayName = "NeuCardHeader";

const NeuCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
NeuCardTitle.displayName = "NeuCardTitle";

const NeuCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
NeuCardDescription.displayName = "NeuCardDescription";

const NeuCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
NeuCardContent.displayName = "NeuCardContent";

const NeuCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6", className)}
    {...props}
  />
));
NeuCardFooter.displayName = "NeuCardFooter";

export { NeuCard, NeuCardHeader, NeuCardFooter, NeuCardTitle, NeuCardDescription, NeuCardContent };

