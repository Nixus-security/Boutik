"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { passwordSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SiteHeader } from "@/components/SiteHeader";

type Status = "checking" | "ready" | "invalid";

export function ReinitialiserMotDePasseForm() {
  const router = useRouter();
  const t = useTranslations("resetPassword");
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
      setError(t("error"));
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
            {status === "checking" && <p className="text-sm text-gray-500">{t("checking")}</p>}

            {status === "invalid" && (
              <>
                <h1 className="text-2xl font-extrabold text-gray-900">{t("invalidTitle")}</h1>
                <p className="mt-2 text-sm text-gray-600">{t("invalidBody")}</p>
                <Link
                  href="/mot-de-passe-oublie"
                  className="mt-4 inline-block text-sm font-semibold text-brand-700"
                >
                  {t("restart")}
                </Link>
              </>
            )}

            {status === "ready" && !done && (
              <>
                <h1 className="text-2xl font-extrabold text-gray-900">{t("newPasswordTitle")}</h1>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                  <Input
                    label={t("newPassword")}
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("newPasswordPlaceholder")}
                  />
                  {error && (
                    <p className="text-sm font-medium text-red-700" role="alert">
                      {error}
                    </p>
                  )}
                  <Button type="submit" loading={loading}>
                    {t("submit")}
                  </Button>
                </form>
              </>
            )}

            {status === "ready" && done && (
              <>
                <h1 className="text-2xl font-extrabold text-gray-900">{t("doneTitle")}</h1>
                <p className="mt-2 text-sm text-gray-600">{t("doneBody")}</p>
                <Button className="mt-4" onClick={() => router.push("/connexion")}>
                  {t("goToLogin")}
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
