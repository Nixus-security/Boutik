import type { Metadata, Viewport } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Boutik : Vends plus facilement sur WhatsApp",
  description:
    "Boutik aide les vendeurs WhatsApp à gérer leur stock, générer leur catalogue et relancer leurs impayés, simplement.",
  openGraph: {
    title: "Boutik",
    description: "Gère ta boutique WhatsApp en 2 minutes par jour.",
    images: ["/logo.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={baloo.variable}>
      <body className={baloo.className}>{children}</body>
    </html>
  );
}
