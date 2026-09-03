import type { SubstackPost } from "@/lib/substack";
import SubstackPostEmbed from "@/components/SubstackPostEmbed";

type SubstackEmbedsProps = {
  posts: SubstackPost[];
  layout?: "stack" | "grid";
};

export default function SubstackEmbeds({
  posts,
  layout = "stack",
}: SubstackEmbedsProps) {
  if (layout === "grid") {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
        {posts.map((post) => (
          <div
            key={post.url}
            className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-brown/10"
          >
            <SubstackPostEmbed post={post} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      {posts.map((post) => (
        <div
          key={post.url}
          className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-brown/10"
        >
          <SubstackPostEmbed post={post} />
        </div>
      ))}
    </div>
  );
}
