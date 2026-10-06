import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Politique de confidentialité : Boutik",
  description: "Comment Boutik collecte, utilise et protège tes données et celles de tes clients.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="mx-auto max-w-3xl px-6 pt-6 sm:px-8">
        <SiteHeader />

        <article className="mt-8">
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Politique de confidentialité</h1>
          <p className="mt-2 text-sm text-gray-500">Dernière mise à jour : 21/09/2026</p>

          <section className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Qui gère tes données</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Boutik est édité par Anthony Nagul, France. Pour toute
              question sur tes données, contacte boutik.contact.support@gmail.com.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Données que Boutik collecte</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Quand tu crées un compte : ton nom de boutique, ton numéro de téléphone, ton email et ta devise
              préférée. Quand tu utilises Boutik : les produits de ton catalogue, les commandes et leur statut de
              paiement. Rien de plus n'est demandé.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">WhatsApp</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Boutik n'utilise pas l'API Business WhatsApp et n'a accès à aucun de tes messages ou conversations.
              Les liens de relance générés par Boutik ouvrent simplement WhatsApp avec un message pré-rempli que
              tu envoies toi-même.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Paiement</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Les abonnements payants sont traités par Stripe (carte bancaire) et Flutterwave (Mobile Money :
              Orange Money, MTN, Wave...). Boutik ne stocke jamais tes coordonnées bancaires : ces prestataires
              les traitent directement selon leurs propres politiques de confidentialité.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Hébergement</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Les données de ton compte et de ta boutique sont hébergées chez Supabase, qui applique ses propres
              mesures de sécurité et de chiffrement.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Cookies</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Boutik utilise un cookie nécessaire au fonctionnement du site, pour retenir ta langue préférée
              (français ou anglais). Si tu acceptes les cookies de mesure d'audience, Google Analytics nous aide
              à comprendre l'usage du site, de façon anonyme. Aucun cookie publicitaire, aucun traceur tiers.
            </p>
          </section>

          <section className="mt-8 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Tes droits</h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Tu peux à tout moment demander l'accès, la correction ou la suppression de tes données en nous
              écrivant à boutik.contact.support@gmail.com. La suppression de ton compte entraîne la suppression de
              ton catalogue et de tes commandes.
            </p>
          </section>
        </article>

        <SiteFooter />
      </div>
    </main>
  );
}
