import * as React from "react"

import { cn } from "../../utils/utils"


const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    variant?: "default" | "volunteer" | "erasmus" | "donate" | "testimonial" 
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "rounded-lg border bg-card text-card-foreground shadow-sm",
    volunteer: "rounded-lg border border-platform-blue/20 bg-white/90 backdrop-blur-sm shadow-elevation-medium hover:shadow-elevation-high transition-all duration-300 hover:translate-y-[-5px]",
    erasmus: "rounded-lg border border-platform-indigo/20 bg-white/90 backdrop-blur-sm shadow-elevation-medium hover:shadow-elevation-high transition-all duration-300 hover:translate-y-[-5px]",
    donate: "rounded-lg border border-platform-purple/20 bg-white/90 backdrop-blur-sm shadow-elevation-medium hover:shadow-elevation-high transition-all duration-300 hover:translate-y-[-5px]",
    testimonial: "rounded-lg border border-white/40 bg-white/80 backdrop-blur-md shadow-elevation-low hover:shadow-elevation-medium transition-all duration-300"
  }

  return (
    <div
      ref={ref}
      className={cn(
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
