import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client à privilèges élevés (service role) : contourne la RLS.
// Réservé au code serveur qui n'a pas de session utilisateur (ex : webhook Stripe).
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
