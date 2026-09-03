"use client";

import Script from "next/script";
import type { SubstackPost } from "@/lib/substack";

type SubstackEmbedsProps = {
  posts: SubstackPost[];
  layout?: "stack" | "grid";
};

export default function SubstackEmbeds({
  posts,
  layout = "stack",
}: SubstackEmbedsProps) {
  const containerClass =
    layout === "grid"
      ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8"
      : "space-y-8";

  const itemClass =
    layout === "grid"
      ? "overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-brown/10"
      : "";

  return (
    <>
      <div className={containerClass}>
        {posts.map((post) => (
          <div key={post.url} className={itemClass}>
            <div className="substack-post-embed substack-post-embed--fit">
              <p lang="en">{post.title}</p>
              <p>{post.description}</p>
              <a data-post-link href={post.url}>
                Read on Substack
              </a>
            </div>
          </div>
        ))}
      </div>
      <Script
        src="https://substack.com/embedjs/embed.js"
        strategy="lazyOnload"
        charSet="utf-8"
      />
    </>
  );
}
