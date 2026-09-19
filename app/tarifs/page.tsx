import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SiteHeader } from "@/components/SiteHeader";
import { type PlanSlug } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Tarifs : Boutik",
  description: "Choisis le forfait Boutik adapté à ta boutique WhatsApp. Sans engagement.",
};

type Plan = {
  slug: PlanSlug;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export default async function TarifsPage() {
  const t = await getTranslations("pricing");
  const tPlans = await getTranslations("plans");

  const plans: Plan[] = [
    {
      slug: "gratuit",
      name: tPlans("gratuit"),
      price: "0€",
      description: t("plans.gratuit.description"),
      features: t.raw("plans.gratuit.features"),
      cta: t("plans.gratuit.cta"),
    },
    {
      slug: "essentiel",
      name: tPlans("essentiel"),
      price: "3€",
      period: t("perMonth"),
      description: t("plans.essentiel.description"),
      features: t.raw("plans.essentiel.features"),
      cta: t("plans.essentiel.cta"),
      highlighted: true,
    },
    {
      slug: "pro",
      name: tPlans("pro"),
      price: "10€",
      period: t("perMonth"),
      description: t("plans.pro.description"),
      features: t.raw("plans.pro.features"),
      cta: t("plans.pro.cta"),
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-5xl px-6 pt-6 sm:px-8">
        <SiteHeader />

        <div className="mt-6 max-w-md">
          <h1 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">{t("title")}</h1>
          <p className="mt-2 text-base text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} mostChosenLabel={t("mostChosen")} />
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          {t("questionPrefix")}{" "}
          <Link href="/connexion" className="font-semibold text-brand-700 underline">
            {t("contact")}
          </Link>
        </p>
      </div>
    </main>
  );
}

function PlanCard({ plan, mostChosenLabel }: { plan: Plan; mostChosenLabel: string }) {
  return (
    <article
      className={`flex flex-col rounded-2xl bg-white p-5 shadow-sm ${
        plan.highlighted ? "border-2 border-gray-900" : "border border-gray-100"
      }`}
    >
      {plan.highlighted && (
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-900">{mostChosenLabel}</p>
      )}

      <h2 className="text-lg font-bold text-gray-900">{plan.name}</h2>
      <p className="mt-1 text-sm text-gray-600">{plan.description}</p>

      <p className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
        {plan.period && <span className="text-sm font-medium text-gray-500">{plan.period}</span>}
      </p>

      <ul className="mt-4 flex-1 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <ButtonLink
        href={`/inscription?plan=${plan.slug}`}
        variant={plan.highlighted ? "primary" : "secondary"}
        className="mt-5"
      >
        {plan.cta}
      </ButtonLink>
    </article>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true">
      <path
        d="M4 10.5L8 14.5L16 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
