"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { type PlanSlug } from "@/lib/plans";
import { MOBILE_MONEY_ENABLED } from "@/lib/features";
import { MobileMoneySoon } from "@/components/MobileMoneySoon";

export function PricingCta({
  slug,
  label,
  highlighted,
  billingError,
  mobileMoneyLabel,
}: {
  slug: PlanSlug;
  label: string;
  highlighted?: boolean;
  billingError: string;
  mobileMoneyLabel: string;
}) {
  const [checkingSession, setCheckingSession] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [redirecting, setRedirecting] = useState<"stripe" | "fedapay" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
      setCheckingSession(false);
    });
  }, []);

  if (checkingSession) {
    return (
      <Button type="button" variant={highlighted ? "primary" : "secondary"} className="mt-5" disabled>
        {label}
      </Button>
    );
  }

  if (slug === "gratuit" || !loggedIn) {
    return (
      <ButtonLink
        href={`/inscription?plan=${slug}`}
        variant={highlighted ? "primary" : "secondary"}
        className="mt-5"
      >
        {label}
      </ButtonLink>
    );
  }

  async function handleClick(provider: "stripe" | "fedapay") {
    setError(null);
    setRedirecting(provider);
    try {
      const res = await fetch(`/api/${provider}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: slug }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error();
      window.location.href = data.url;
    } catch {
      setError(billingError);
      setRedirecting(null);
    }
  }

  return (
    <div className="mt-5 space-y-2">
      <Button
        type="button"
        variant={highlighted ? "primary" : "secondary"}
        className="w-full"
        loading={redirecting === "stripe"}
        disabled={redirecting !== null}
        onClick={() => handleClick("stripe")}
      >
        {label}
      </Button>
      {MOBILE_MONEY_ENABLED ? (
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          loading={redirecting === "fedapay"}
          disabled={redirecting !== null}
          onClick={() => handleClick("fedapay")}
        >
          {mobileMoneyLabel}
        </Button>
      ) : (
        <MobileMoneySoon />
      )}
      {error && (
        <p className="mt-2 text-xs font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
