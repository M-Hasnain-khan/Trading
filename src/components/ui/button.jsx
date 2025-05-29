import React from "react"
import { cn } from "../lib/utils"

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : "button"

    const variantStyles = {
      default: "bg-yellow-500 text-black hover:bg-yellow-400",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline: "border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black",
      secondary: "bg-gray-800 text-white hover:bg-gray-700",
      ghost: "hover:bg-gray-800 text-gray-300 hover:text-white",
      link: "text-yellow-500 underline-offset-4 hover:underline",
    }

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10 rounded-md",
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)

Button.displayName = "Button"

export { Button }
