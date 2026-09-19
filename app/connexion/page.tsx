"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { exitDemo } from "@/lib/demo";
import { loginSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SiteHeader } from "@/components/SiteHeader";

export default function ConnexionPage() {
  const router = useRouter();
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
      setError("Email ou mot de passe incorrect.");
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
            <h1 className="text-2xl font-extrabold text-gray-900">Connexion</h1>
            <p className="mt-1 text-sm text-gray-500">Content de te revoir.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <Input
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@exemple.com"
              />
              <Input
                label="Mot de passe"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Link href="/mot-de-passe-oublie" className="block text-sm font-semibold text-brand-600">
                Mot de passe oublié ?
              </Link>
              {error && (
                <p className="text-sm font-medium text-red-700" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" loading={loading}>
                Se connecter
              </Button>
            </form>
          </Card>

          <p className="mt-6 text-center text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="font-semibold text-brand-600">
              Inscris-toi
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
