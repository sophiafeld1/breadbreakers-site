"use client";

import { useEffect, useRef, useState } from "react";
import type { SubstackPost } from "@/lib/substack";

function buildEmbedSrc(postUrl: string): string | null {
  const match = postUrl.match(/^(.*)\/p\/([^/?#]+)/);
  if (!match) return null;

  const [, baseUrl, slug] = match;
  const frameURL = new URL(`${baseUrl}/embed/p/${slug}`);
  frameURL.searchParams.set("origin", window.location.origin);
  frameURL.searchParams.set("fullURL", window.location.href);
  return frameURL.toString();
}

function getSubstackOrigin(postUrl: string): string | null {
  const match = postUrl.match(/^(https?:\/\/[^/]+)/);
  return match?.[1] ?? null;
}

type SubstackPostEmbedProps = {
  post: SubstackPost;
};

export default function SubstackPostEmbed({ post }: SubstackPostEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    setSrc(buildEmbedSrc(post.url));
  }, [post.url]);

  useEffect(() => {
    const substackOrigin = getSubstackOrigin(post.url);
    if (!substackOrigin) return;

    function handleMessage(event: MessageEvent) {
      if (
        event.origin === substackOrigin &&
        event.source === iframeRef.current?.contentWindow &&
        event.data?.iframeHeight &&
        iframeRef.current
      ) {
        iframeRef.current.height = String(event.data.iframeHeight);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [post.url]);

  if (!src) {
    return <div className="min-h-[470px] animate-pulse bg-brown/5" aria-hidden />;
  }

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={post.title}
      scrolling="no"
      height={470}
      sandbox="allow-scripts allow-same-origin allow-top-navigation allow-popups"
      allow="clipboard-read clipboard-write allow-top-navigation allow-scripts allow-same-origin allow-popups"
      className="block w-full border-0 bg-white"
    />
  );
}
