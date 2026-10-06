const isDev = process.env.NODE_ENV === "development";

// Nonce par requête + 'strict-dynamic' : les scripts inline de Next (hydratation) ne passent que
// s'ils portent le nonce, sans ouvrir 'unsafe-inline'.
export function buildCsp(nonce: string): string {
  const supabaseHost = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).host;
  const scriptSrc = ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", ...(isDev ? ["'unsafe-eval'"] : [])].join(" ");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: https://${supabaseHost} https://www.googletagmanager.com`,
    "font-src 'self' data:",
    `connect-src 'self' https://${supabaseHost} wss://${supabaseHost} https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com`,
    "object-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}
