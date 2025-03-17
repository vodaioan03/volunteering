import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"


import { cn } from "../../utils/utils"





const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom variants
        "volunteer": "bg-platform-blue text-white hover:bg-platform-blue/90 shadow-elevation-low hover:shadow-elevation-medium transition-all duration-300 hover:translate-y-[-2px]",
        "erasmus": "bg-platform-indigo text-white hover:bg-platform-indigo/90 shadow-elevation-low hover:shadow-elevation-medium transition-all duration-300 hover:translate-y-[-2px]",
        "donate": "bg-platform-purple text-white hover:bg-platform-purple/90 shadow-elevation-low hover:shadow-elevation-medium transition-all duration-300 hover:translate-y-[-2px]",
        "cta": "bg-white text-platform-blue hover:bg-white/90 border border-transparent shadow-elevation-medium hover:shadow-elevation-high transition-all duration-300",
        "cta-outline": "bg-transparent border-2 border-white text-white hover:bg-white/10 transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        // Custom sizes
        "pill": "h-10 px-6 py-2 rounded-full",
        "pill-lg": "h-12 px-8 py-3 rounded-full text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
