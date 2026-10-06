import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import logoIcon from "@/public/logo-icon.png";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <Image src={logoIcon} alt="" width={48} height={48} className="h-12 w-12" />
      <p className="mt-6 text-sm font-bold uppercase tracking-wide text-brand-700">Erreur 404</p>
      <h1 className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">Cette page n'existe pas</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-600 sm:text-base">
        Le lien est peut-être cassé ou la page a été déplacée.
      </p>
      <div className="mt-6 w-full max-w-xs">
        <ButtonLink href="/">Retour à l'accueil</ButtonLink>
      </div>
    </main>
  );
}
