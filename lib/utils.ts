/**
 * Utility function to conditionally join CSS class names.
 * 
 * Filters out falsy values and joins the remaining classes with spaces.
 * Useful for conditional styling in React components.
 */
export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}


