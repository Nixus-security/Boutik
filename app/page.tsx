"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { enterDemo } from "@/lib/demo";
import { IconArrowRight, IconUser } from "@/components/icons";
import logoFull from "@/public/logo-full.png";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="h-screen overflow-hidden bg-gray-50">
      <div className="mx-auto flex h-full max-w-5xl flex-col px-6 pt-4 sm:px-8">
        <header className="flex items-center justify-center">
          <Image src={logoFull} alt="Boutik" width={48} height={48} className="h-12 w-12" priority />
        </header>

        <section className="relative mt-4 flex-1 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-600 to-brand-400 p-6 sm:p-8 md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-brand-300 opacity-30 blur-3xl motion-safe:animate-none"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-brand-900 opacity-30 blur-3xl"
          />

          <div className="relative flex h-full flex-col gap-4 md:grid md:grid-cols-2 md:items-center md:gap-12">
            <div className="shrink-0 md:flex md:flex-col md:justify-center">
              <h1 className="text-xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
                Gère ta boutique WhatsApp en 2 minutes par jour
              </h1>
              <p className="mt-3 max-w-md text-sm text-brand-50 sm:text-lg">
                Importe ton stock, génère ton catalogue automatiquement, et ne perds plus jamais
                un client qui ne t'a pas payé.
              </p>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden md:flex-none md:overflow-visible">
              <PhonePreview />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md space-y-2 py-4">
          <Link
            href="/inscription"
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 text-base font-bold text-white transition hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            <IconUser className="h-5 w-5" />
            Créer mon compte gratuit
            <IconArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/connexion"
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border-2 border-brand-500 px-6 text-base font-bold text-brand-700 transition hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <IconUser className="h-5 w-5" />
            J'ai déjà un compte
          </Link>
          <button
            onClick={() => {
              enterDemo();
              router.push("/app");
            }}
            className="min-h-[44px] w-full rounded-xl px-4 py-3 text-center text-sm font-semibold text-brand-700 underline"
          >
            Tester sans compte (mode démo)
          </button>
        </section>
      </div>
    </main>
  );
}

const PREVIEW_CLIPS = ["/hero-preview.mp4", "/brag-preview.mp4", "/howto-preview.mp4"];

function PhonePreview() {
  const [clipIndex, setClipIndex] = useState(0);

  function handleEnded() {
    setClipIndex((i) => (i + 1) % PREVIEW_CLIPS.length);
  }

  return (
    <div className="aspect-[9/16] h-full w-auto max-w-full overflow-hidden rounded-2xl bg-gray-950 shadow-2xl md:h-auto md:w-[280px]">
      <video
        key={PREVIEW_CLIPS[clipIndex]}
        className="h-full w-full object-cover"
        src={PREVIEW_CLIPS[clipIndex]}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
      />
    </div>
  );
}
