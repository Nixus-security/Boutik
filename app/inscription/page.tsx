import type { Metadata } from "next";
import { InscriptionClient } from "./InscriptionClient";

export const metadata: Metadata = {
  title: "Créer un compte : Boutik",
  description: "Crée ton compte Boutik gratuitement et lance ta boutique WhatsApp en quelques minutes.",
  alternates: { canonical: "/inscription" },
};

export default function InscriptionPage() {
  return <InscriptionClient />;
}
