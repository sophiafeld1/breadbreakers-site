import DashboardLogoutButton from "@/components/DashboardLogoutButton";
import DashboardNav from "@/components/DashboardNav";

export default function ProtectedDashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <>
      <header className="border-b border-brown/10 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brown">
              Internal
            </p>
            <h1 className="text-lg font-semibold text-brown-dark">
              BreadBreakers Dashboard
            </h1>
          </div>
          <DashboardLogoutButton />
        </div>
      </header>
      <DashboardNav />
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </>
  );
}
