import type { Metadata } from "next";
import ArticleEmbedCard from "@/components/ArticleEmbedCard";
import SubstackPostEmbed from "@/components/SubstackPostEmbed";
import { ministryMattersPost } from "@/lib/media-mentions";
import { mediaMentionPosts } from "@/lib/substack";

export const metadata: Metadata = {
  title: "Media Mentions | BreadBreakers",
};

export default function MediaMentionsPage() {
  const substackPost = mediaMentionPosts[0];

  return (
    <section className="bg-sand px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-brown/10">
            <SubstackPostEmbed post={substackPost} />
          </div>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-brown/10">
            <ArticleEmbedCard article={ministryMattersPost} />
          </div>
        </div>

        <blockquote className="border-l-4 border-brand pl-6 text-lg leading-relaxed text-brown-dark">
          &ldquo;In my faith tradition, there&apos;s a rabbi named Jesus who was
          asked over 100 questions in his teaching career. He directly answered
          only three. Instead of giving answers, he asked more than 300
          questions and told stories. Tonight, let&apos;s embrace curiosity, ask
          questions, and learn from each other.&rdquo; — Daniel Park
        </blockquote>
      </div>
    </section>
  );
}
