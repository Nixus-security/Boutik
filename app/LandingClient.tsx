"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { enterDemo } from "@/lib/demo";
import { IconArrowRight, IconChat, IconCheck, IconPlus, IconUpload, IconUser } from "@/components/icons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { Card } from "@/components/ui/Card";
import { Marquee } from "@/components/ui/marquee";
import logoIcon from "@/public/logo-icon.png";
import phoneMockup from "@/public/phone-mockup.png";

export function LandingClient() {
  const router = useRouter();
  const t = useTranslations("landing");

  function goToDemo() {
    enterDemo();
    router.push("/app");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-4 sm:px-8">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <Image src={logoIcon} alt="" width={36} height={36} className="h-9 w-9" priority />
            <span className="translate-y-[9px] text-lg font-extrabold leading-none text-gray-900">Boutik</span>
          </Link>
          <nav aria-label={t("navFeatures")} className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
            <a href="#fonctionnalites" className="rounded hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
              {t("navFeatures")}
            </a>
            <Link href="/tarifs" className="rounded hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
              {t("navPricing")}
            </Link>
            <a href="#temoignages" className="rounded hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
              {t("navTestimonials")}
            </a>
            <a href="#faq" className="rounded hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
              {t("navFaq")}
            </a>
          </nav>
          <LanguageSwitcher />
        </header>

        <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-100 via-brand-50 to-white p-6 pb-0 sm:p-8 sm:pb-1 md:p-12 md:pb-1">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-200 [animation:orb-pulse_6s_ease-in-out_infinite]"
          />

          <div className="relative grid gap-10 md:grid-cols-2 md:items-center md:gap-12">
            <div>
              <Reveal delay={0}>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-700">{t("eyebrow")}</p>
              </Reveal>
              <Reveal delay={90}>
                <h1 className="mt-3 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl">
                  <HighlightedTitle title={t("title")} />
                </h1>
              </Reveal>
              <Reveal delay={180}>
                <p className="mt-4 max-w-md text-sm text-gray-600 sm:text-lg">{t("subtitle")}</p>
              </Reveal>

              <Reveal delay={270}>
                <Link
                  href="/inscription"
                  className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-6 text-base font-bold text-white transition hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 sm:w-auto"
                >
                  {t("createAccount")}
                  <IconArrowRight className="h-5 w-5" />
                </Link>

                <button
                  onClick={goToDemo}
                  className="mt-3 text-sm font-semibold text-brand-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                >
                  {t("heroCta")}
                </button>
              </Reveal>

              <Reveal delay={360}>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
                  {(t.raw("checklist") as string[]).map((word) => (
                    <li key={word} className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <IconCheck className="h-4 w-4 text-brand-600" />
                      {word}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal variant="wipe" delay={200} className="flex min-w-0 items-center justify-end -mr-6 sm:-mr-8 md:-mr-9 lg:-mr-14">
              <PhonePlaceholder />
            </Reveal>
          </div>
        </section>

        <HowItWorksSection t={t} />
        <FeaturesSection t={t} />
        <TestimonialsSection t={t} />
        <FaqSection t={t} />
        <FinalCtaSection t={t} onDemo={goToDemo} />

        <section className="mx-auto mt-10 w-full max-w-md space-y-2">
          <Link
            href="/inscription"
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-6 text-base font-bold text-white transition hover:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
          >
            <IconUser className="h-5 w-5" />
            {t("createAccount")}
            <IconArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/connexion"
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border-2 border-brand-500 px-6 text-base font-bold text-brand-700 transition hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <IconUser className="h-5 w-5" />
            {t("haveAccount")}
          </Link>
          <button
            onClick={goToDemo}
            className="min-h-[44px] w-full rounded-xl px-4 py-3 text-center text-sm font-semibold text-brand-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {t("tryDemo")}
          </button>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}

type T = ReturnType<typeof useTranslations>;

function HowItWorksSection({ t }: { t: T }) {
  const steps = t.raw("howItWorks.steps") as { title: string; description: string }[];

  return (
    <section id="comment-ca-marche" aria-labelledby="how-it-works-title" className="mx-auto mt-20 max-w-4xl scroll-mt-6 text-center">
      <Reveal>
        <h2 id="how-it-works-title" className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          {t("howItWorks.title")}
        </h2>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">{t("howItWorks.subtitle")}</p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3 sm:gap-6">
        {steps.map((step, i) => (
          <Reveal key={step.title} variant="wipe" delay={i * 150}>
            <div className="relative overflow-hidden rounded-3xl bg-brand-50 p-6">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-2 -top-4 select-none text-7xl font-black text-brand-100"
              >
                {i + 1}
              </span>

              <div className="relative h-14 w-14">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border-2 border-dashed border-brand-300 [animation:spin_7s_linear_infinite]"
                />
                <span className="absolute inset-1.5 flex items-center justify-center rounded-full bg-white">
                  <StepIcon index={i} />
                </span>
              </div>

              <h3 className="relative mt-4 text-base font-bold text-gray-900">{step.title}</h3>
              <p className="relative mt-1 text-sm text-gray-600">{step.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function StepIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <span className="relative flex items-center justify-center" aria-hidden="true">
        <span className="absolute h-1 w-1 rounded-full bg-brand-500 [animation:step-float-up_1.8s_ease-out_infinite]" />
        <IconUpload className="h-6 w-6 text-brand-600 [animation:bounce_1.8s_ease-in-out_infinite]" />
      </span>
    );
  }

  if (index === 1) {
    return (
      <span className="relative flex items-center justify-center" aria-hidden="true">
        <span className="absolute h-8 w-8 rounded-full bg-brand-300 [animation:ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <IconChat className="relative h-6 w-6 text-brand-600 [animation:step-wiggle_1.6s_ease-in-out_infinite]" />
      </span>
    );
  }

  return (
    <span className="flex h-6 items-end gap-1" aria-hidden="true">
      <span className="h-3 w-1.5 origin-bottom rounded-sm bg-brand-400 [animation:step-bar-grow_1.1s_ease-in-out_0ms_infinite]" />
      <span className="h-6 w-1.5 origin-bottom rounded-sm bg-brand-600 [animation:step-bar-grow_1.1s_ease-in-out_150ms_infinite]" />
      <span className="h-4 w-1.5 origin-bottom rounded-sm bg-brand-500 [animation:step-bar-grow_1.1s_ease-in-out_300ms_infinite]" />
    </span>
  );
}

function FinalCtaSection({ t, onDemo }: { t: T; onDemo: () => void }) {
  return (
    <Reveal variant="wipe" className="mt-20">
      <section className="relative overflow-hidden rounded-3xl bg-brand-700 p-8 sm:p-10 md:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-brand-500 [animation:orb-pulse-plain_7s_ease-in-out_infinite]"
        />
        <div className="relative">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{t("finalCta.title")}</h2>
          <p className="mt-2 max-w-md text-sm text-brand-50 sm:text-base">{t("finalCta.subtitle")}</p>

          <button
            onClick={onDemo}
            className="mt-6 flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-6 text-base font-bold text-brand-700 transition hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t("finalCta.cta")}
            <IconArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </Reveal>
  );
}

function FeaturesSection({ t }: { t: T }) {
  const items = t.raw("featuresSection.items") as { title: string; description: string }[];

  return (
    <section id="fonctionnalites" aria-labelledby="fonctionnalites-title" className="mx-auto mt-20 max-w-2xl scroll-mt-6">
      <Reveal>
        <div className="max-w-xl">
          <h2 id="fonctionnalites-title" className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {t("featuresSection.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">{t("featuresSection.subtitle")}</p>
        </div>
      </Reveal>

      <Reveal variant="wipe" delay={150} className="mt-8">
        <article className="overflow-hidden rounded-2xl bg-brand-50">
          <TransparentVideo src="/catalogue-demo.mp4" className="aspect-[4/3] w-full object-cover" />
          <div className="p-6">
            <h3 className="text-base font-bold text-gray-900">{items[0].title}</h3>
            <p className="mt-1 text-sm text-gray-600">{items[0].description}</p>
          </div>
        </article>
      </Reveal>
    </section>
  );
}

function TransparentVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Ne joue/dessine la vidéo que quand elle est visible à l'écran : la boucle de compositing
  // (getImageData/putImageData à chaque frame) est coûteuse en CPU, pas la peine de la faire
  // tourner en continu depuis le chargement de la page pour une section plus bas dans le scroll.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!video || !canvas || !ctx || !inView) {
      video?.pause();
      return;
    }

    video.play().catch(() => {});

    let frameId: number;
    let buffer: HTMLCanvasElement | null = null;
    let bufferCtx: CanvasRenderingContext2D | null = null;

    function draw() {
      if (video && canvas && ctx && video.videoWidth) {
        const halfWidth = video.videoWidth / 2;
        const height = video.videoHeight;

        if (canvas.width !== halfWidth) {
          canvas.width = halfWidth;
          canvas.height = height;
        }
        if (!buffer) {
          buffer = document.createElement("canvas");
          buffer.width = video.videoWidth;
          buffer.height = height;
          bufferCtx = buffer.getContext("2d", { willReadFrequently: true });
        }

        if (bufferCtx && buffer) {
          bufferCtx.drawImage(video, 0, 0, buffer.width, buffer.height);
          const colorData = bufferCtx.getImageData(0, 0, halfWidth, height);
          const alphaData = bufferCtx.getImageData(halfWidth, 0, halfWidth, height);
          const out = ctx.createImageData(halfWidth, height);
          for (let i = 0; i < out.data.length; i += 4) {
            out.data[i] = colorData.data[i];
            out.data[i + 1] = colorData.data[i + 1];
            out.data[i + 2] = colorData.data[i + 2];
            out.data[i + 3] = alphaData.data[i];
          }
          ctx.putImageData(out, 0, 0);
        }
      }
      frameId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(frameId);
      video.pause();
    };
  }, [inView]);

  return (
    <div ref={containerRef} className={`relative bg-brand-50 ${className ?? ""}`}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full opacity-0"
        aria-hidden="true"
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}

function TestimonialCard({ name, role, quote }: { name: string; role: string; quote: string }) {
  return (
    <Card className="flex h-full w-80 shrink-0 flex-col gap-4 p-6">
      <p className="text-sm leading-relaxed text-gray-700">{quote}</p>
      <div className="mt-auto flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700"
          aria-hidden="true"
        >
          {name.charAt(0)}
        </span>
        <div>
          <p className="text-sm font-bold text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </Card>
  );
}

function TestimonialsSection({ t }: { t: T }) {
  const items = t.raw("testimonials.items") as { name: string; role: string; quote: string; time: string }[];

  return (
    <section id="temoignages" aria-labelledby="temoignages-title" className="mx-auto mt-20 max-w-5xl scroll-mt-6">
      <Reveal>
        <h2 id="temoignages-title" className="text-center text-2xl font-extrabold text-gray-900 sm:text-3xl">
          {t("testimonials.title")}
        </h2>
      </Reveal>

      <Reveal variant="wipe" delay={150} className="relative mt-8">
        <Marquee pauseOnHover>
          {items.map((item) => (
            <TestimonialCard key={item.name} {...item} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white sm:w-24" />
      </Reveal>
    </section>
  );
}

function FaqSection({ t }: { t: T }) {
  const items = t.raw("faq.items") as { question: string; answer: string }[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="mx-auto mt-20 max-w-2xl scroll-mt-6">
      <Reveal>
        <h2 id="faq-title" className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          {t("faq.title")}
        </h2>
      </Reveal>

      <Reveal variant="wipe" delay={150} className="mt-6">
        <div className="divide-y divide-gray-200 rounded-2xl border border-gray-100 bg-white">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            const panelId = `faq-panel-${i}`;
            return (
              <div key={item.question}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex min-h-[52px] w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                  >
                    {item.question}
                    <IconPlus
                      className={`h-4 w-4 shrink-0 text-brand-600 transition-transform motion-reduce:transition-none ${isOpen ? "rotate-45" : ""}`}
                    />
                  </button>
                </h3>
                {isOpen && (
                  <p id={panelId} className="px-5 pb-4 text-sm text-gray-600">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}

function HighlightedTitle({ title }: { title: string }) {
  const match = title.match(/\d+/);
  if (!match || match.index === undefined) return <>{title}</>;
  const start = match.index;
  const end = start + match[0].length;
  return (
    <>
      {title.slice(0, start)}
      <span className="text-brand-500">{title.slice(start, end)}</span>
      {title.slice(end)}
    </>
  );
}

function PhonePlaceholder() {
  const t = useTranslations("landing");
  return (
    <div className="w-full max-w-[280px] sm:max-w-[320px]">
      <Image src={phoneMockup} alt={t("heroImageAlt")} className="h-auto w-full" priority />
    </div>
  );
}
