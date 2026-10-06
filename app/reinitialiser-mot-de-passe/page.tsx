import type { Metadata } from "next";
import { ReinitialiserMotDePasseForm } from "./ReinitialiserMotDePasseForm";

export const metadata: Metadata = {
  title: "Nouveau mot de passe : Boutik",
  description: "Choisis un nouveau mot de passe pour ton compte Boutik.",
  alternates: { canonical: "/reinitialiser-mot-de-passe" },
};

export default function ReinitialiserMotDePassePage() {
  return <ReinitialiserMotDePasseForm />;
}
