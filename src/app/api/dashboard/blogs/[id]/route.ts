import { NextResponse } from "next/server";
import { deleteBlogPost, updateBlogPost } from "@/lib/blogs-db";
import { requireMasterApi } from "@/lib/dashboard-auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const unauthorized = await requireMasterApi();
  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await context.params;
  let payload: { url?: string };

  try {
    payload = (await request.json()) as { url?: string };
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  try {
    const post = await updateBlogPost(id, payload.url ?? "");
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

    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ message: "Blog post not found." }, { status: 404 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error("Update blog post error:", error);
    return NextResponse.json(
      { message: "Unable to update blog post." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const unauthorized = await requireMasterApi();
  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await context.params;

  try {
    await deleteBlogPost(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      return NextResponse.json({ message: "Blog post not found." }, { status: 404 });
    }

    console.error("Delete blog post error:", error);
    return NextResponse.json(
      { message: "Unable to remove blog post." },
      { status: 500 },
    );
  }
}
