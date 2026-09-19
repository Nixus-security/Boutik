"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { emailSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SiteHeader } from "@/components/SiteHeader";

export default function MotDePasseOubliePage() {
  const t = useTranslations("forgotPassword");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Email invalide.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
    });
    // Toujours un succès côté UI (compte existant ou non) pour ne pas révéler
    // quels emails sont inscrits.
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <main className="min-h-screen bg-gray-50 pb-12">
        <div className="mx-auto max-w-5xl px-6 pt-6 sm:px-8">
          <SiteHeader />
          <div className="mx-auto mt-10 w-full max-w-md">
            <Card className="p-6 text-center">
              <h1 className="text-2xl font-extrabold text-gray-900">{t("sentTitle")}</h1>
              <p className="mt-2 text-sm text-gray-600">{t("sentBody", { email })}</p>
              <Link href="/connexion" className="mt-6 inline-block text-sm font-semibold text-brand-600">
                {t("backToLogin")}
              </Link>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-5xl px-6 pt-6 sm:px-8">
        <SiteHeader />

        <div className="mx-auto mt-10 w-full max-w-md">
          <Card className="p-6">
            <h1 className="text-2xl font-extrabold text-gray-900">{t("title")}</h1>
            <p className="mt-1 text-sm text-gray-500">{t("subtitle")}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <Input
                label={t("email")}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@exemple.com"
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
          </Card>

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link href="/connexion" className="font-semibold text-brand-600">
              {t("backToLogin")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
