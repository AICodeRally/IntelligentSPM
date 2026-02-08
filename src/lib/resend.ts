/**
 * Resend Email Client
 *
 * Lazy-initialized Resend client to avoid build-time errors
 * when RESEND_API_KEY is not available.
 */

import type { Resend } from "resend";

let resendClient: Resend | null = null;

/**
 * Get the Resend client instance.
 * Uses lazy initialization to avoid import errors during build.
 */
export async function getResend(): Promise<Resend> {
  if (!resendClient) {
    const { Resend } = await import("resend");
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

/**
 * Check if Resend is configured with an API key.
 */
export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
