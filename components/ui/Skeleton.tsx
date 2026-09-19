import type { ReactNode } from "react";

const CARD_CLASS = "rounded-2xl border border-gray-100 bg-white p-4 shadow-sm";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`} />;
}

function SkeletonGroup({ rows, children }: { rows: number; children: (i: number) => ReactNode }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-live="polite">
      <span className="sr-only">Chargement en cours</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={CARD_CLASS}>
          {children(i)}
        </div>
      ))}
    </div>
  );
}

/** Ligne générique (liste simple à une ligne). */
export function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <SkeletonGroup rows={rows}>
      {() => (
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      )}
    </SkeletonGroup>
  );
}

/** Reproduit la carte produit (texte + prix + bouton 44px) pour éviter tout saut de mise en page. */
export function ProductSkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <SkeletonGroup rows={rows}>
      {() => (
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
        </div>
      )}
    </SkeletonGroup>
  );
}

/** Reproduit la carte commande (client + statut, puis date + montant) pour éviter tout saut de mise en page. */
export function OrderSkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <SkeletonGroup rows={rows}>
      {() => (
        <>
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </>
      )}
    </SkeletonGroup>
  );
}

/** Reproduit la carte relance (client + montant, puis deux boutons 44px) pour éviter tout saut de mise en page. */
export function RelanceSkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <SkeletonGroup rows={rows}>
      {() => (
        <>
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        </>
      )}
    </SkeletonGroup>
  );
}
