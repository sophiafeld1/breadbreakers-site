import { Suspense } from "react";
import DashboardLoginForm from "@/components/DashboardLoginForm";

export default function DashboardLoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-brown/10">
        <p className="text-xs font-medium uppercase tracking-wide text-brown">
          Internal access
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-brown-dark">
          Sign in to dashboard
        </h1>
        <p className="mt-2 text-sm text-brown">
          For BreadBreakers team members only.
        </p>

        <div className="mt-6">
          <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-brown/5" />}>
            <DashboardLoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
