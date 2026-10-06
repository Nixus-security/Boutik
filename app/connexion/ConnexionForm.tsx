"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { exitDemo } from "@/lib/demo";
import { loginSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SiteHeader } from "@/components/SiteHeader";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";

export function ConnexionForm() {
  const router = useRouter();
  const t = useTranslations("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Formulaire invalide.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
      setError(t("invalidCredentials"));
      setLoading(false);
      return;
    }

    exitDemo();
    router.push("/app");
    router.refresh();
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
              <Input
                label={t("password")}
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Link href="/mot-de-passe-oublie" className="block text-sm font-semibold text-brand-700">
                {t("forgotPassword")}
              </Link>
              {error && (
                <p className="text-sm font-medium text-red-700" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" loading={loading}>
                {t("submit")}
              </Button>
            </form>

            <div className="mt-4 flex items-center gap-3 text-xs font-medium uppercase text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              {t("orSeparator")}
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="mt-4">
              <GoogleAuthButton label={t("continueWithGoogle")} />
            </div>
          </Card>

          <p className="mt-6 text-center text-sm text-gray-500">
            {t("noAccount")}{" "}
            <Link href="/inscription" className="font-semibold text-brand-700">
              {t("signup")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
