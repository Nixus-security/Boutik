import Image from "next/image";
import Link from "next/link";
import logoFull from "@/public/logo-full.png";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center">
        <Image src={logoFull} alt="Boutik" width={48} height={48} className="h-12 w-12" priority />
      </Link>
      <Link
        href="/connexion"
        className="flex min-h-[44px] items-center rounded-full px-4 text-sm font-semibold text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        Connexion
      </Link>
    </header>
  );
}
