"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import PasswordInput from "@/components/PasswordInput";

type DashboardUser = {
  id: string;
  username: string;
  role: "MASTER" | "USER";
};

export default function UserAccessManager() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/dashboard/users");
      const data = (await response.json()) as {
        users?: DashboardUser[];
        message?: string;
      };

      if (!response.ok) {
        setError(data.message ?? "Unable to load users.");
        return;
      }

      setUsers(data.users ?? []);
    } catch {
      setError("Unable to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function handleAddUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/dashboard/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Unable to add user.");
        return;
      }

      const addedUsername = username.trim();
      setUsername("");
      setPassword("");
      setMessage(`Added user "${addedUsername}".`);
      await loadUsers();
    } catch {
      setError("Unable to add user.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemoveUser(user: DashboardUser) {
    const confirmed = window.confirm(
      `Remove access for "${user.username}"? They will no longer be able to sign in.`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/dashboard/users/${user.id}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Unable to remove user.");
        return;
      }

      setMessage(`Removed user "${user.username}".`);
      await loadUsers();
    } catch {
      setError("Unable to remove user.");
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <h2 className="text-lg font-semibold text-brown-dark">Add user</h2>
        <p className="mt-1 text-sm text-brown">
          Create dashboard access for a team member. Passwords are stored
          securely and cannot be viewed after creation.
        </p>

        <form onSubmit={handleAddUser} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="new-username"
              className="mb-1 block text-sm font-medium text-brown-dark"
            >
              Username
            </label>
            <input
              id="new-username"
              type="text"
              required
              minLength={3}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-brown/20 px-3 py-2 text-brown-dark outline-none ring-brand/30 focus:ring-2"
            />
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="mb-1 block text-sm font-medium text-brown-dark"
            >
              Password
            </label>
            <PasswordInput
              id="new-password"
              required
              minLength={12}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <p className="mt-1 text-xs text-brown">At least 12 characters.</p>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-cream transition hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Adding…" : "Add user"}
            </button>
          </div>
        </form>

        {error ? (
          <p className="mt-4 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="mt-4 text-sm text-brand" role="status">
            {message}
          </p>
        ) : null}
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brown/10">
        <h2 className="text-lg font-semibold text-brown-dark">
          Dashboard users
        </h2>

        {loading ? (
          <p className="mt-4 text-sm text-brown">Loading users…</p>
        ) : users.length === 0 ? (
          <p className="mt-4 text-sm text-brown">No users found.</p>
        ) : (
          <ul className="mt-4 divide-y divide-brown/10">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div>
                  <p className="font-medium text-brown-dark">{user.username}</p>
                  <p className="text-sm text-brown">
                    {user.role === "MASTER" ? "Master access" : "Standard access"}
                  </p>
                </div>

                {user.role === "USER" ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(user)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                ) : (
                  <span className="text-xs font-medium uppercase tracking-wide text-brown">
                    Protected
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
