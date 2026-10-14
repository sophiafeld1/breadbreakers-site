import { NextResponse } from "next/server";
import { createBlogPost, listBlogPosts } from "@/lib/blogs-db";
import { requireMasterApi } from "@/lib/dashboard-auth";

export async function GET() {
  const unauthorized = await requireMasterApi();
  if (unauthorized) {
    return unauthorized;
  }

  const posts = await listBlogPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const unauthorized = await requireMasterApi();
  if (unauthorized) {
    return unauthorized;
  }

  let payload: { url?: string };

  try {
    payload = (await request.json()) as { url?: string };
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  try {
    const post = await createBlogPost(payload.url ?? "");
    return NextResponse.json({ post });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "That Substack post is already on the blog." },
        { status: 409 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error("Create blog post error:", error);
    return NextResponse.json(
      { message: "Unable to add blog post." },
      { status: 500 },
    );
  }
}
