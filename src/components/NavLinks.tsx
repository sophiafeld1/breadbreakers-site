"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavItemActive, navLinks } from "@/lib/nav";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-6">
      {navLinks.map((link) => {
        const isActive = isNavItemActive(pathname, link);

        if (link.children) {
          return (
            <div key={link.href} className="group relative">
              <Link
                href={link.href}
                className={`text-sm font-medium uppercase tracking-wider text-cream hover:opacity-80 ${
                  isActive ? "border-b border-cream pb-0.5" : ""
                }`}
              >
                {link.label}
              </Link>
              <div className="invisible absolute left-0 top-full z-50 min-w-[200px] pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="rounded-md border border-cream/20 bg-brand py-2 shadow-lg">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-4 py-2 text-sm uppercase tracking-wider text-cream hover:bg-white/10 ${
                        pathname === child.href ? "bg-white/10 font-semibold" : ""
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium uppercase tracking-wider text-cream hover:opacity-80 ${
              isActive ? "border-b border-cream pb-0.5" : ""
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
