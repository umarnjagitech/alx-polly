import { isRedirectError } from "next/dist/client/components/redirect";
import { StandardActionResult } from "@/lib/types/polls";

export function toActionError(err: unknown, fallback: string): StandardActionResult<never> {
  if (err && typeof err === "object" && (err as any)?.digest === "NEXT_REDIRECT") {
    throw err as any;
  }
  if (isRedirectError(err as any)) {
    throw err as any;
  }

  const message = typeof (err as any)?.message === "string" ? (err as any).message : String(err);
  return {
    ok: false,
    error: {
      code: "ACTION_ERROR",
      message: `${fallback} ${message}`.trim(),
      cause: err,
    },
  };
}


