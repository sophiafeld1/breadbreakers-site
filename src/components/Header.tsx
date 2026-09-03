import Image from "next/image";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import { images } from "@/lib/site";

export default function Header() {
  return (
    <header className="bg-brand px-6 py-4">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={images.logo}
            alt=""
            width={96}
            height={96}
            className="h-24 w-24"
            priority
          />
          <span className="text-xl font-medium tracking-wide text-cream">
            BreadBreakers
          </span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
