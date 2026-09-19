"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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

export default function ComptePage() {
  const router = useRouter();
  const demo = isDemo();
  const { setCurrency: setSharedCurrency } = useCurrency();
  const t = useTranslations("account");
  const tPlans = useTranslations("plans");
  const tCurrency = useTranslations("currency");

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
      .catch(() => setProfileError(t("loadError")))
      .finally(() => setLoading(false));
  }, []);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileSaved(false);

    if (!businessName.trim()) {
      setProfileError(t("businessNameRequired"));
      return;
    }

    setSavingProfile(true);
    try {
      await updateAccount({ businessName: businessName.trim(), phone: phone.trim(), currency });
      setSharedCurrency(currency);
      setProfileSaved(true);
    } catch {
      setProfileError(t("saveError"));
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
      setPasswordError(t("passwordError"));
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
      <h1 className="text-xl font-extrabold text-gray-900">{t("title")}</h1>

      <Card>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">{t("shopSection")}</p>

          {email && (
            <p className="text-sm text-gray-500">{t("connectedAs", { email })}</p>
          )}

          <Input
            label={t("businessName")}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder={t("businessNamePlaceholder")}
            required
          />

          <Input
            label={t("phone")}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("phonePlaceholder")}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="currency-select">
              {t("currency")}
            </label>
            <select
              id="currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {tCurrency(c.code)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">{t("currencyHint")}</p>
          </div>

          {profileError && (
            <p className="text-sm font-medium text-red-700" role="alert">
              {profileError}
            </p>
          )}
          {profileSaved && (
            <p className="text-sm font-medium text-brand-700" role="status">
              {t("saved")}
            </p>
          )}

          <Button type="submit" loading={savingProfile}>
            {t("save")}
          </Button>
        </form>
      </Card>

      {!demo && (
        <Card>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <p className="text-sm font-semibold text-gray-700">{t("passwordSection")}</p>

            <Input
              label={t("newPassword")}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("newPasswordPlaceholder")}
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
                {t("passwordSaved")}
              </p>
            )}

            <Button type="submit" variant="secondary" loading={savingPassword}>
              {t("changePassword")}
            </Button>
          </form>
        </Card>
      )}

      <Card className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">{t("subscriptionSection")}</p>
        <p className="text-sm text-gray-600">
          {t("currentPlan", { plan: tPlans(plan) })}
        </p>
        <ButtonLink href="/tarifs" variant="secondary">
          {t("seePricing")}
        </ButtonLink>
      </Card>

      <button
        type="button"
        onClick={handleLogout}
        className="min-h-[44px] w-full rounded-xl px-4 py-3 text-center text-sm font-semibold text-red-700"
      >
        {t("logout")}
      </button>
    </div>
  );
}
