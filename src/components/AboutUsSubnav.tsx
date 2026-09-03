"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { aboutUsLinks } from "@/lib/nav";

export default function AboutUsSubnav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="About Us sections"
      className="border-b border-brown/20 bg-cream"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-6 px-6 py-4 md:gap-10">
        {aboutUsLinks.map(({ href, label }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`text-sm font-semibold uppercase tracking-wider text-brown-dark transition-opacity hover:opacity-80 ${
                isActive ? "border-b-2 border-brand pb-1" : ""
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
