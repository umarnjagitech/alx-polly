/**
 * Button component with multiple variants and sizes.
 * 
 * Provides consistent styling and behavior for interactive elements.
 * Supports different visual styles and sizes for various use cases.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "destructive" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "default", size = "md", ...props },
    ref
  ) {
    const base =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      default:
        "bg-black text-white hover:bg-black/90 focus-visible:ring-black dark:bg-white dark:text-black dark:hover:bg-white/90 dark:focus-visible:ring-white",
      secondary:
        "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-700",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
      ghost:
        "hover:bg-gray-100 text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
      outline:
        "border border-gray-300 hover:bg-gray-100 text-gray-900 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800",
    };
    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "h-9 px-3",
      md: "h-10 px-4",
      lg: "h-11 px-6 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);


