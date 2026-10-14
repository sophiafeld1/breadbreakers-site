import { redirect } from "next/navigation";
import BlogPostManager from "@/components/BlogPostManager";
import { getSession } from "@/lib/auth/server";

export default async function DashboardBlogsPage() {
  const session = await getSession();

  if (session.role !== "master") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-brown-dark">Blog</h2>
        <p className="mt-1 text-brown">
          Master access only. Add or remove Substack posts. Changes show on the
          public Blog page immediately.
        </p>
      </div>

      <BlogPostManager />
    </div>
  );
}
