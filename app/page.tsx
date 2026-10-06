import type { Metadata } from "next";
import { LandingClient } from "./LandingClient";

export const metadata: Metadata = {
  title: "Boutik : Vends plus facilement sur WhatsApp",
  description:
    "Boutik aide les vendeurs WhatsApp à gérer leur stock, générer leur catalogue et relancer leurs impayés, simplement.",
  alternates: { canonical: "/" },
};

export default function Page() {
  return <LandingClient />;
}
