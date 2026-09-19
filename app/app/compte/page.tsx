"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccount, updateAccount, changePassword } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/client";
import { isDemo } from "@/lib/demo";
import { passwordSchema } from "@/lib/schemas";
import { type PlanSlug } from "@/lib/plans";
import { CURRENCIES, DEFAULT_CURRENCY } from "@/lib/currency";
import { useCurrency } from "@/lib/currency-context";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const planLabels: Record<PlanSlug, string> = {
  gratuit: "Gratuit",
  essentiel: "Essentiel",
  pro: "Pro",
};

export default function ComptePage() {
  const router = useRouter();
  const demo = isDemo();
  const { setCurrency: setSharedCurrency } = useCurrency();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [plan, setPlan] = useState<PlanSlug>("gratuit");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    getAccount()
      .then((account) => {
        setEmail(account.email);
        setBusinessName(account.businessName);
        setPhone(account.phone);
        setCurrency(account.currency);
        setPlan(account.plan);
      })
      .catch(() => setProfileError("Impossible de charger ton compte. Réessaie dans un instant."))
      .finally(() => setLoading(false));
  }, []);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileSaved(false);

    if (!businessName.trim()) {
      setProfileError("Le nom de la boutique est requis.");
      return;
    }

    setSavingProfile(true);
    try {
      await updateAccount({ businessName: businessName.trim(), phone: phone.trim(), currency });
      setSharedCurrency(currency);
      setProfileSaved(true);
    } catch {
      setProfileError("Impossible d'enregistrer ces informations. Réessaie.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSaved(false);

    const parsed = passwordSchema.safeParse(newPassword);
    if (!parsed.success) {
      setPasswordError(parsed.error.issues[0]?.message ?? "Mot de passe invalide.");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(parsed.data);
      setNewPassword("");
      setPasswordSaved(true);
    } catch {
      setPasswordError("Impossible de changer le mot de passe. Réessaie.");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleLogout() {
    if (!demo) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <h1 className="text-xl font-extrabold text-gray-900">Mon compte</h1>

      <Card>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">Ma boutique</p>

          {email && (
            <p className="text-sm text-gray-500">
              Connecté avec <span className="font-medium text-gray-700">{email}</span>
            </p>
          )}

          <Input
            label="Nom de la boutique"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Ex : Chez Aïcha"
            required
          />

          <Input
            label="Téléphone (optionnel)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ex : 07 09 12 34 56"
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="currency-select">
              Devise
            </label>
            <select
              id="currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              S'applique aux prix affichés dans l'app et sur ton catalogue.
            </p>
          </div>

          {profileError && (
            <p className="text-sm font-medium text-red-700" role="alert">
              {profileError}
            </p>
          )}
          {profileSaved && (
            <p className="text-sm font-medium text-brand-700" role="status">
              Informations enregistrées.
            </p>
          )}

          <Button type="submit" loading={savingProfile}>
            Enregistrer
          </Button>
        </form>
      </Card>

      {!demo && (
        <Card>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">Mot de passe</p>

            <Input
              label="Nouveau mot de passe"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="6 caractères minimum"
              minLength={6}
              required
            />

            {passwordError && (
              <p className="text-sm font-medium text-red-700" role="alert">
                {passwordError}
              </p>
            )}
            {passwordSaved && (
              <p className="text-sm font-medium text-brand-700" role="status">
                Mot de passe mis à jour.
              </p>
            )}

            <Button type="submit" variant="secondary" loading={savingPassword}>
              Changer le mot de passe
            </Button>
          </form>
        </Card>
      )}

      <Card className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">Abonnement</p>
        <p className="text-sm text-gray-600">
          Forfait actuel : <span className="font-bold text-gray-900">{planLabels[plan]}</span>
        </p>
        <ButtonLink href="/tarifs" variant="secondary">
          Voir les tarifs
        </ButtonLink>
      </Card>

      <button
        type="button"
        onClick={handleLogout}
        className="min-h-[44px] w-full rounded-xl px-4 py-3 text-center text-sm font-semibold text-red-700"
      >
        Se déconnecter
      </button>
    </div>
  );
}
