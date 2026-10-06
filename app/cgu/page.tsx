import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation : Boutik",
  description: "Les règles d'utilisation du service Boutik.",
  alternates: { canonical: "/cgu" },
};

export default function CguPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-3xl px-6 pt-6 sm:px-8">
        <SiteHeader />

        <article className="mt-8">
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Conditions générales d'utilisation</h1>
          <p className="mt-2 text-sm text-gray-500">Dernière mise à jour : [DATE À COMPLÉTER]</p>

          <section className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Le service</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Boutik, édité par Anthony Nagul, aide les vendeurs à gérer leur stock,
              générer un catalogue et suivre leurs commandes et relances sur WhatsApp. En créant un compte, tu
              acceptes ces conditions.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Ton compte</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Tu es responsable des informations que tu ajoutes à ton catalogue et de l'exactitude de tes
              commandes. Garde tes identifiants de connexion confidentiels.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Forfaits et paiement</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Boutik propose un forfait gratuit et des forfaits payants (Essentiel, Pro), facturés au mois via
              Stripe ou Flutterwave. Un forfait payant via Mobile Money couvre 30 jours et n'est pas reconduit
              automatiquement : il faut repayer pour le renouveler. Aucun remboursement n'est dû pour un mois déjà
              entamé, sauf erreur de facturation de notre part.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Usage autorisé</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Boutik ne doit pas servir à vendre des produits illégaux, à usurper l'identité d'un tiers, ou à
              envoyer des messages non sollicités en masse. Nous nous réservons le droit de suspendre un compte
              qui enfreint ces règles.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Disponibilité</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Boutik fait son possible pour maintenir le service accessible, sans garantie de disponibilité
              continue. Des interruptions ponctuelles pour maintenance peuvent survenir.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Résiliation</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Tu peux supprimer ton compte à tout moment depuis la page Mon compte. Nous pouvons suspendre ou
              supprimer un compte en cas de non-respect de ces conditions.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Contact</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Pour toute question sur ces conditions : boutik.contact.support@gmail.com.
            </p>
          </section>
        </article>

        <SiteFooter />
      </div>
    </main>
  );
}
