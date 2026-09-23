import type { Metadata } from "next";
import SubstackEmbeds from "@/components/SubstackEmbeds";
import { blogPosts } from "@/lib/substack";

export const metadata: Metadata = {
  title: "Blog | BreadBreakers",
};

export default function BlogPage() {
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

        <SubstackEmbeds posts={blogPosts} layout="grid" />
      </div>
    </section>
  );
}
