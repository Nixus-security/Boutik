"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "boutik_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage indisponible (navigation privée) : on affiche par défaut
      setVisible(true);
    }
  }, []);

  function respond(choice: "accepted" | "declined") {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // rien à faire si le stockage échoue, le bandeau reviendra au prochain chargement
    }
    if (choice === "accepted") window.dispatchEvent(new Event("boutik:cookie-consent-accepted"));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-4 shadow-lg sm:inset-x-auto sm:right-4"
    >
      <p className="text-sm text-gray-700">
        Boutik utilise un cookie pour retenir ta langue préférée, et des cookies de mesure d'audience si tu
        acceptes. Pas de traceur publicitaire.{" "}
        <Link
          href="/confidentialite"
          className="font-semibold text-brand-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          En savoir plus
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => respond("accepted")}
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
        >
          Accepter
        </button>
        <button
          type="button"
          onClick={() => respond("declined")}
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          Refuser
        </button>
      </div>
    </div>
  );
}
