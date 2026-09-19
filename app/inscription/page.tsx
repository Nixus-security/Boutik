"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { exitDemo } from "@/lib/demo";
import { signupSchema } from "@/lib/schemas";
import { PLAN_SLUGS, type PlanSlug } from "@/lib/plans";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SiteHeader } from "@/components/SiteHeader";
import { IconMail } from "@/components/icons";

const planLabels: Record<PlanSlug, string> = {
  gratuit: "Gratuit",
  essentiel: "Essentiel",
  pro: "Pro",
};

export default function InscriptionPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-5xl px-6 pt-6 sm:px-8">
        <SiteHeader />
        <div className="mx-auto mt-10 max-w-md">
          <Suspense fallback={null}>
            <InscriptionForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

function InscriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get("plan");
  const plan: PlanSlug = PLAN_SLUGS.includes(requestedPlan as PlanSlug)
    ? (requestedPlan as PlanSlug)
    : "gratuit";
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = signupSchema.safeParse({ businessName, email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Formulaire invalide.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { data: { business_name: parsed.data.businessName, plan } },
    });

    if (error) {
      setError("Impossible de créer le compte. Réessaie dans un instant.");
      setLoading(false);
      return;
    }

    if (data.session) {
      exitDemo();
      router.push("/app");
      router.refresh();
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <IconMail className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-xl font-extrabold text-gray-900">Vérifie ta boîte mail</h1>
        <p className="mt-2 text-sm text-gray-500">
          On t'a envoyé un lien de confirmation à {email}. Clique dessus pour activer ton compte.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center text-2xl font-extrabold text-gray-900">Créer mon compte</h1>
      <p className="mt-1 text-center text-sm text-gray-500">
        {plan === "gratuit" ? "Gratuit, prêt en 1 minute." : `Forfait ${planLabels[plan]} sélectionné.`}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <Input
          label="Nom de ta boutique"
          required
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Ex : Chez Aïcha"
        />
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
          Créer mon compte
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="font-semibold text-brand-600">
          Connecte-toi
        </Link>
      </p>
    </div>
  );
}
