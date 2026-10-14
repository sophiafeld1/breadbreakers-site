"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type BlogPost = {
  id: string;
  url: string;
  title: string;
};

export default function BlogPostManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [url, setUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/dashboard/blogs");
      const data = (await response.json()) as {
        posts?: BlogPost[];
        message?: string;
      };

      if (!response.ok) {
        setError(data.message ?? "Unable to load blog posts.");
        return;
      }

      setPosts(data.posts ?? []);
    } catch {
      setError("Unable to load blog posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/dashboard/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Unable to add blog.");
        return;
      }

      setUrl("");
      setMessage("Blog added to the public site.");
      await loadPosts();
    } catch {
      setError("Unable to add blog.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSave(id: string) {
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/dashboard/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: editingUrl }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Unable to update blog.");
        return;
      }

      setEditingId(null);
      setEditingUrl("");
      setMessage("Blog URL updated.");
      await loadPosts();
    } catch {
      setError("Unable to update blog.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(post: BlogPost) {
    const confirmed = window.confirm(
      `Remove this post from the blog page?\n${post.url}`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/dashboard/blogs/${post.id}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Unable to remove blog.");
        return;
      }

      setMessage("Blog removed from the public site.");
      await loadPosts();
    } catch {
      setError("Unable to remove blog.");
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <h2 className="text-lg font-semibold text-brown-dark">Add blog</h2>
        <p className="mt-1 text-sm text-brown">
          Paste a Substack post URL. It will show up on the public Blog page.
        </p>

        <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            required
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://breadbreakers.substack.com/p/your-post"
            className="min-w-0 flex-1 rounded-lg border border-brown/20 px-3 py-2.5 text-brown-dark outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-cream transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add blog"}
          </button>
        </form>
      </section>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-brand">{message}</p> : null}

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <h2 className="text-lg font-semibold text-brown-dark">Existing blogs</h2>

        {loading ? (
          <p className="mt-4 text-sm text-brown">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="mt-4 text-sm text-brown">No blog posts yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-brown/10">
            {posts.map((post) => {
              const isEditing = editingId === post.id;

              return (
                <li key={post.id} className="py-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={editingUrl}
                        onChange={(event) => setEditingUrl(event.target.value)}
                        className="w-full rounded-lg border border-brown/20 px-3 py-2.5 text-brown-dark outline-none focus:border-brand"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => void handleSave(post.id)}
                          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-cream transition hover:opacity-90 disabled:opacity-60"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(null);
                            setEditingUrl("");
                          }}
                          className="rounded-lg border border-brown/20 px-4 py-2 text-sm font-medium text-brown-dark transition hover:bg-brown/5"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-brown-dark">{post.title}</p>
                        <p className="truncate text-sm text-brown">{post.url}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(post.id);
                            setEditingUrl(post.url);
                          }}
                          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-cream transition hover:opacity-90"
                        >
                          Edit URL
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleRemove(post)}
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
