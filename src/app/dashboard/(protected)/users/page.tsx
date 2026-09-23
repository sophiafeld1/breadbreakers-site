import { redirect } from "next/navigation";
import UserAccessManager from "@/components/UserAccessManager";
import { getSession } from "@/lib/auth/server";

export default async function DashboardUsersPage() {
  const session = await getSession();

  if (session.role !== "master") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-brown-dark">User access</h2>
        <p className="mt-1 text-brown">
          Master access only. Add or remove users, view saved passwords, or
          reset them if someone forgets.
        </p>
      </div>

      <UserAccessManager />
    </div>
  );
}
