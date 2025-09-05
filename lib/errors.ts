/**
 * Error handling utilities for the ALX Polly application.
 *
 * This module provides centralized error handling for server actions and async operations
 * throughout the application. It specifically handles Next.js redirect errors and converts
 * other errors into standardized action results that can be consumed by UI components.
 *
 * Key responsibilities:
 * - Detect and properly re-throw Next.js redirect errors (which are expected control flow)
 * - Convert unexpected errors into standardized `StandardActionResult` format
 * - Provide consistent error messaging and error codes across the application
 *
 * Context in the app:
 * - Used by server actions in `/app/polls/actions.ts` to handle errors during poll operations
 * - Ensures UI components receive consistent error structures for display
 * - Maintains Next.js App Router redirect functionality when errors occur during navigation
 *
 * @fileoverview Error handling utilities for server actions and async operations
 */

import { StandardActionResult } from "@/lib/types/polls";

/**
 * Type guard to detect Next.js redirect errors.
 *
 * In Next.js 15, the `redirect()` function throws an error with a special digest
 * to signal that a redirect should occur. This is the expected behavior and these
 * errors should be re-thrown to allow the redirect to proceed.
 *
 * @param error - The error to check
 * @returns True if the error is a Next.js redirect error that should be re-thrown
 */
function isRedirectError(error: unknown): error is Error & { digest: string } {
  return (
    error != null &&
    typeof error === "object" &&
    (error as any)?.digest === "NEXT_REDIRECT"
  );
}

/**
 * Converts errors into standardized action results for consistent error handling.
 *
 * This function is the primary error handler for server actions in the application.
 * It distinguishes between Next.js redirect errors (which should be re-thrown to
 * allow navigation) and actual errors (which should be converted to error results).
 *
 * Usage pattern:
 * ```typescript
 * export async function myServerAction(formData: FormData) {
 *   try {
 *     // ... perform operation
 *     return { ok: true, data: result };
 *   } catch (err) {
 *     return toActionError(err, "Failed to perform action:");
 *   }
 * }
 * ```
 *
 * @param err - The error that occurred (can be any type)
 * @param fallback - A fallback message to use if the error doesn't have a message
 * @returns A standardized error result with consistent structure
 * @throws Re-throws the error if it's a Next.js redirect (expected control flow)
 *
 * @example
 * ```typescript
 * // In a server action
 * try {
 *   await createPoll(data);
 * } catch (err) {
 *   return toActionError(err, "Failed to create poll:");
 * }
 * // Returns: { ok: false, error: { code: "ACTION_ERROR", message: "Failed to create poll: Database connection failed", cause: originalError } }
 * ```
 */
export function toActionError(
  err: unknown,
  fallback: string,
): StandardActionResult<never> {
  // In Next.js 15, redirects throw errors with NEXT_REDIRECT digest
  // These are expected and should be re-thrown to allow the redirect to proceed
  if (isRedirectError(err)) {
    throw err as any;
  }

  // Extract error message from various error types
  const message =
    typeof (err as any)?.message === "string"
      ? (err as any).message
      : String(err);

  // Return standardized error result
  return {
    ok: false,
    error: {
      code: "ACTION_ERROR",
      message: `${fallback} ${message}`.trim(),
      cause: err,
    },
  };
}
