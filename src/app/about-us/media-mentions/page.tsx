import type { Metadata } from "next";
import SubstackEmbeds from "@/components/SubstackEmbeds";
import { mediaMentionPosts } from "@/lib/substack";

export const metadata: Metadata = {
  title: "Media Mentions | BreadBreakers",
};

export default function MediaMentionsPage() {
  return (
    <section className="bg-sand px-6 py-12 md:py-16">
      <div className="mx-auto max-w-3xl space-y-12">
        <SubstackEmbeds posts={mediaMentionPosts} />

        <blockquote className="border-l-4 border-brand pl-6 text-lg leading-relaxed text-brown-dark">
          &ldquo;In my faith tradition, there&apos;s a rabbi named Jesus who was
          asked over 100 questions in his teaching career. He directly answered
          only three. Instead of giving answers, he asked more than 300
          questions and told stories. Tonight, let&apos;s embrace curiosity, ask
          questions, and learn from each other.&rdquo; — Daniel Park
        </blockquote>

        <p className="text-lg text-brown-dark">
          Read the full article here:{" "}
          <a
            href="https://ministrymatters.com/2025-06-06_building_bridges_one_table_at_a_time/"
            target="_blank"
            rel="noreferrer"
            className="text-brand underline-offset-2 hover:underline"
          >
            Ministry Matters — Building bridges one table at a time
          </a>
        </p>
      </div>
    </section>
  );
}
