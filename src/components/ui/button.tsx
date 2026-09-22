import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded text-sm font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap cursor-pointer hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-xs active:translate-y-0 active:scale-100",
  {
    variants: {
      variant: {
        primary: "bg-[#1A1A1A] text-[#FAFAF8] hover:bg-[#2D2D2D] active:bg-[#111111]",
        default: "bg-[#1A1A1A] text-[#FAFAF8] hover:bg-[#2D2D2D] active:bg-[#111111]",
        accent: "bg-[#8B7355] text-white hover:bg-[#786246] active:bg-[#685339]",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary hover:border-foreground/30",
        ghost: "text-foreground hover:bg-secondary",
        subtle: "bg-secondary text-foreground hover:bg-muted",
        secondary: "bg-secondary text-foreground hover:bg-muted",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "px-3.5 py-1.5 text-xs font-semibold tracking-wide",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3 text-sm font-semibold tracking-wide",
        block: "w-full px-5 py-3 rounded",
        default: "px-5 py-2.5 text-sm",
        icon: "size-9 p-0 rounded",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
