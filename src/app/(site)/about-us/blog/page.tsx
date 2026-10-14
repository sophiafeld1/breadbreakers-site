import type { Metadata } from "next";
import SubstackEmbeds from "@/components/SubstackEmbeds";
import { listPublicBlogPosts } from "@/lib/blogs-db";

export const metadata: Metadata = {
  title: "Blog | BreadBreakers",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await listPublicBlogPosts();

  return (
    <section className="bg-sand px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center md:mb-12">
          <h1 className="text-3xl font-bold text-brown-dark md:text-4xl">
            Blog
          </h1>
          <p className="mt-3 text-lg text-brown">
            Stories and reflections from the BreadBreakers community
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-brown">
            New posts will appear here soon.
          </p>
        ) : (
          <SubstackEmbeds posts={posts} layout="grid" />
        )}
      </div>
    </section>
  );
}
