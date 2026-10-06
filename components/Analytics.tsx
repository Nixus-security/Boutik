"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const STORAGE_KEY = "boutik_cookie_consent";
const CONSENT_EVENT = "boutik:cookie-consent-accepted";

export function Analytics({ nonce }: { nonce?: string }) {
  const [enabled, setEnabled] = useState(false);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!gaId) return;

    try {
      if (localStorage.getItem(STORAGE_KEY) === "accepted") setEnabled(true);
    } catch {
      // localStorage indisponible : pas d'analytics tant que le choix n'est pas confirmé
    }

    function onConsentAccepted() {
      setEnabled(true);
    }
    window.addEventListener(CONSENT_EVENT, onConsentAccepted);
    return () => window.removeEventListener(CONSENT_EVENT, onConsentAccepted);
  }, [gaId]);

  if (!gaId || !enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" nonce={nonce} />
      <Script id="ga-init" strategy="afterInteractive" nonce={nonce}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
