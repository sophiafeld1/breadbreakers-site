import Link from "next/link";
import { getSession } from "@/lib/auth/server";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/users", label: "User access", masterOnly: true },
] as const;

export default async function DashboardNav() {
  const session = await getSession();

  return (
    <nav className="border-b border-brown/10 bg-cream">
      <div className="mx-auto flex max-w-5xl gap-1 px-6 py-2">
        {links.map((link) => {
          if ("masterOnly" in link && link.masterOnly && session.role !== "master") {
            return null;
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-brown transition hover:bg-white hover:text-brown-dark"
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
