import type { Metadata } from "next";
import { ConnexionForm } from "./ConnexionForm";

export const metadata: Metadata = {
  title: "Connexion : Boutik",
  description: "Connecte-toi à ton compte Boutik pour gérer ta boutique WhatsApp.",
  alternates: { canonical: "/connexion" },
};

export default function ConnexionPage() {
  return <ConnexionForm />;
}
