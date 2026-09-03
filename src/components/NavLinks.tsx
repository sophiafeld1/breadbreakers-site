"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/nav";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-6">
      {navLinks.map(({ href, label }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={`text-sm font-medium uppercase tracking-wider text-cream hover:opacity-80 ${
              isActive ? "border-b border-cream pb-0.5" : ""
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
