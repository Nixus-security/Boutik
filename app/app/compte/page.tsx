"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { getAccount, updateAccount, changePassword, convertAccountCurrency } from "@/lib/data/profile";
import { createClient } from "@/lib/supabase/client";
import { isDemo } from "@/lib/demo";
import { passwordSchema } from "@/lib/schemas";
import { type PlanSlug } from "@/lib/plans";
import { CURRENCIES, DEFAULT_CURRENCY } from "@/lib/currency";
import { useCurrency } from "@/lib/currency-context";
import { IconPhone } from "@/components/icons";
import { MobileMoneySoon } from "@/components/MobileMoneySoon";
import { MOBILE_MONEY_ENABLED } from "@/lib/features";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const PLAN_PRICES: Record<"essentiel" | "pro", string> = {
  essentiel: "3€",
  pro: "10€",
};

export default function ComptePage() {
  const router = useRouter();
  const demo = isDemo();
  const { setCurrency: setSharedCurrency } = useCurrency();
  const t = useTranslations("account");
  const tPlans = useTranslations("plans");
  const tCurrency = useTranslations("currency");
  const tPricing = useTranslations("pricing");

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [loadedCurrency, setLoadedCurrency] = useState(DEFAULT_CURRENCY);
  const [plan, setPlan] = useState<PlanSlug>("gratuit");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [redirecting, setRedirecting] = useState<`${PlanSlug}:${"stripe" | "fedapay"}` | "portal" | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    getAccount()
      .then((account) => {
        setEmail(account.email);
        setBusinessName(account.businessName);
        setPhone(account.phone);
        setCurrency(account.currency);
        setLoadedCurrency(account.currency);
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

    const currencyChanged = currency !== loadedCurrency;
    if (currencyChanged && !confirm(t("currencyChangeConfirm", { from: loadedCurrency, to: currency }))) {
      return;
    }

    setSavingProfile(true);
    try {
      await updateAccount({ businessName: businessName.trim(), phone: phone.trim(), currency });
      setSharedCurrency(currency);

      if (currencyChanged) {
        await convertAccountCurrency(loadedCurrency, currency).catch(() => {
          throw new Error("convert-failed");
        });
        setLoadedCurrency(currency);
      }

      setProfileSaved(true);
    } catch (err) {
      setProfileError(err instanceof Error && err.message === "convert-failed" ? t("currencyConvertError") : t("saveError"));
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

  async function handleUpgrade(targetPlan: "essentiel" | "pro", provider: "stripe" | "fedapay") {
    setBillingError(null);
    setRedirecting(`${targetPlan}:${provider}`);
    try {
      const res = await fetch(`/api/${provider}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: targetPlan }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error();
      window.location.href = data.url;
    } catch {
      setBillingError(t("billingError"));
      setRedirecting(null);
    }
  }

  async function handleManageBilling() {
    setBillingError(null);
    setRedirecting("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error();
      window.location.href = data.url;
    } catch {
      setBillingError(t("billingError"));
      setRedirecting(null);
    }
  }

  async function handleCancelSubscription() {
    if (!confirm(t("cancelConfirm", { plan: tPlans(plan) }))) return;

    setBillingError(null);
    setCancelSuccess(false);
    setCanceling(true);
    try {
      const res = await fetch("/api/subscriptions/cancel", { method: "POST" });
      if (!res.ok) throw new Error();
      setPlan("gratuit");
      setCancelSuccess(true);
    } catch {
      setBillingError(t("cancelError"));
    } finally {
      setCanceling(false);
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

        {billingError && (
          <p className="text-sm font-medium text-red-700" role="alert">
            {billingError}
          </p>
        )}

        {!demo && plan === "gratuit" && (
          <div className="space-y-3">
            {(["essentiel", "pro"] as const).map((targetPlan) => (
              <div key={targetPlan} className="rounded-2xl border border-gray-200 p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-bold text-gray-900">{tPlans(targetPlan)}</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {PLAN_PRICES[targetPlan]}
                    <span className="font-normal text-gray-500">{tPricing("perMonth")}</span>
                  </p>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    onClick={() => handleUpgrade(targetPlan, "stripe")}
                    loading={redirecting === `${targetPlan}:stripe`}
                    disabled={redirecting !== null}
                    className="flex-1"
                  >
                    {t("payByCard")}
                  </Button>
                  {MOBILE_MONEY_ENABLED ? (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleUpgrade(targetPlan, "fedapay")}
                      loading={redirecting === `${targetPlan}:fedapay`}
                      disabled={redirecting !== null}
                      className="flex-1 gap-2"
                    >
                      <IconPhone className="h-4 w-4" />
                      {t("payByMobileMoney")}
                    </Button>
                  ) : (
                    <MobileMoneySoon className="flex-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {cancelSuccess && (
          <p className="text-sm font-medium text-brand-700" role="status">
            {t("cancelSuccess")}
          </p>
        )}

        {!demo && plan !== "gratuit" && (
          <div className="space-y-2">
            <Button type="button" variant="secondary" onClick={handleManageBilling} loading={redirecting === "portal"} disabled={redirecting !== null || canceling}>
              {t("manageBilling")}
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleCancelSubscription}
              loading={canceling}
              disabled={redirecting !== null || canceling}
            >
              {t("cancelSubscription")}
            </Button>
          </div>
        )}

        <ButtonLink href="/tarifs" variant="ghost">
          {t("seePricing")}
        </ButtonLink>
      </Card>

      <button
        type="button"
        onClick={handleLogout}
        className="min-h-[44px] w-full rounded-xl px-4 py-3 text-center text-sm font-semibold text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        {t("logout")}
      </button>
    </div>
  );
}
