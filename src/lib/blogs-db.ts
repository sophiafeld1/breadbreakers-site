import { prisma } from "@/lib/db";
import {
  fetchSubstackTitle,
  parseSubstackPostUrl,
  titleFromSlug,
} from "@/lib/substack-url";
import type { SubstackPost } from "@/lib/substack";

export type BlogPostRecord = {
  id: string;
  url: string;
  title: string;
  description: string;
  createdAt: Date;
};

async function resolvePostFields(rawUrl: string) {
  const parsed = parseSubstackPostUrl(rawUrl);

  if (!parsed) {
    throw new Error(
      "Enter a Substack post URL, like https://breadbreakers.substack.com/p/your-post.",
    );
  }

  const fetchedTitle = await fetchSubstackTitle(parsed.url);

  return {
    url: parsed.url,
    title: fetchedTitle ?? titleFromSlug(parsed.slug),
    description: "",
  };
}

export async function listBlogPosts(): Promise<BlogPostRecord[]> {
  return prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function listPublicBlogPosts(): Promise<SubstackPost[]> {
  const posts = await listBlogPosts();

  return posts.map((post) => ({
    title: post.title,
    description: post.description,
    url: post.url,
  }));
}

export async function createBlogPost(rawUrl: string): Promise<BlogPostRecord> {
  const data = await resolvePostFields(rawUrl);

  return prisma.blogPost.create({ data });
}

export async function updateBlogPost(
  id: string,
  rawUrl: string,
): Promise<BlogPostRecord> {
  const data = await resolvePostFields(rawUrl);

  return prisma.blogPost.update({
    where: { id },
    data,
  });
}

export async function deleteBlogPost(id: string): Promise<void> {
  await prisma.blogPost.delete({ where: { id } });
}
