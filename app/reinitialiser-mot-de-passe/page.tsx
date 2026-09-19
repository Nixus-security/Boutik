"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { passwordSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SiteHeader } from "@/components/SiteHeader";

type Status = "checking" | "ready" | "invalid";

export default function ReinitialiserMotDePassePage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let settled = false;

    // Supabase envoie un événement PASSWORD_RECOVERY quand le lien de l'email est traité.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        settled = true;
        setStatus("ready");
      }
    });

    // Filet de sécurité si la session de récupération était déjà active au montage.
    supabase.auth.getSession().then(({ data }) => {
      if (!settled) setStatus(data.session ? "ready" : "invalid");
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Mot de passe invalide.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: parsed.data });
    if (error) {
      setError("Impossible de mettre à jour le mot de passe. Réessaie.");
      setLoading(false);
      return;
    }
    setDone(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-5xl px-6 pt-6 sm:px-8">
        <SiteHeader />

        <div className="mx-auto mt-10 w-full max-w-md">
          <Card className="p-6">
            {status === "checking" && <p className="text-sm text-gray-500">Vérification du lien…</p>}

            {status === "invalid" && (
              <>
                <h1 className="text-2xl font-extrabold text-gray-900">Lien invalide ou expiré</h1>
                <p className="mt-2 text-sm text-gray-600">Demande un nouveau lien de réinitialisation.</p>
                <Link
                  href="/mot-de-passe-oublie"
                  className="mt-4 inline-block text-sm font-semibold text-brand-600"
                >
                  Recommencer
                </Link>
              </>
            )}

            {status === "ready" && !done && (
              <>
                <h1 className="text-2xl font-extrabold text-gray-900">Nouveau mot de passe</h1>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                  <Input
                    label="Nouveau mot de passe"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6 caractères minimum"
                  />
                  {error && (
                    <p className="text-sm font-medium text-red-700" role="alert">
                      {error}
                    </p>
                  )}
                  <Button type="submit" loading={loading}>
                    Valider
                  </Button>
                </form>
              </>
            )}

            {status === "ready" && done && (
              <>
                <h1 className="text-2xl font-extrabold text-gray-900">Mot de passe mis à jour</h1>
                <p className="mt-2 text-sm text-gray-600">Tu peux maintenant te connecter.</p>
                <Button className="mt-4" onClick={() => router.push("/connexion")}>
                  Aller à la connexion
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
