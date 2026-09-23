import type { ArticleCard } from "@/lib/media-mentions";

type ArticleEmbedCardProps = {
  article: ArticleCard;
};

export default function ArticleEmbedCard({ article }: ArticleEmbedCardProps) {
  const authorLine = article.authors.join(" and ");

  return (
    <article className="flex h-full flex-col bg-white">
      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className="block overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.imageUrl}
          alt=""
          className="aspect-[1.91/1] w-full object-cover"
        />
      </a>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="group"
        >
          <h2 className="text-xl font-bold leading-snug text-brown-dark group-hover:text-brand">
            {article.title}
          </h2>
        </a>

        <p className="mt-2 text-sm leading-relaxed text-brown">
          {article.description}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-brown-dark/80">
          {article.excerpt}
        </p>

        <div className="mt-4 flex items-center gap-3 border-t border-brown/10 pt-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded bg-[#ed6d30] text-xs font-bold text-white">
            MM
          </div>
          <div className="min-w-0 text-sm">
            <p className="font-semibold text-brown-dark">{authorLine}</p>
            <p className="text-brown">{article.publication}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end text-xs text-brown/70">
          <time dateTime="2025-06-06">{article.date}</time>
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-brown/20 px-4 py-2.5 text-sm font-medium text-[#ed6d30] transition hover:border-[#ed6d30]/40 hover:bg-[#ed6d30]/5"
        >
          {article.ctaLabel}
        </a>
      </div>
    </article>
  );
}
