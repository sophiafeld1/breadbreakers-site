import { getSession } from "@/lib/auth/server";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <h2 className="text-xl font-semibold text-brown-dark">
          Welcome{session.username ? `, ${session.username}` : ""}
        </h2>
        <p className="mt-2 text-brown">
          {session.role === "master"
            ? "You have master access. Use the User access tab to manage who can sign in to this internal site."
            : "You are signed in to the BreadBreakers internal dashboard."}
        </p>
      </section>

      {session.role === "master" ? (
        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
          <h3 className="font-semibold text-brown-dark">Coming soon</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-brown">
            <li>Events database and editing</li>
            <li>RSVP signups and attendance counts</li>
          </ul>
        </section>
      ) : null}
    </div>
  );
}
