import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | BreadBreakers",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return <div className="min-h-screen bg-sand text-brown-dark">{children}</div>;
}
