import type { Metadata } from "next";
import { MotDePasseOublieForm } from "./MotDePasseOublieForm";

export const metadata: Metadata = {
  title: "Mot de passe oublié : Boutik",
  description: "Réinitialise le mot de passe de ton compte Boutik.",
  alternates: { canonical: "/mot-de-passe-oublie" },
};

export default function MotDePasseOubliePage() {
  return <MotDePasseOublieForm />;
}
