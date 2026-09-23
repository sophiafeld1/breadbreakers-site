"use client";

import { useState } from "react";
import PasswordInput from "@/components/PasswordInput";

type StoredPasswordCellProps = {
  userId: string;
  password: string | null;
  onPasswordUpdated: () => Promise<void>;
};

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

export default function StoredPasswordCell({
  userId,
  password,
  onPasswordUpdated,
}: StoredPasswordCellProps) {
  const [visible, setVisible] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleResetPassword() {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/dashboard/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Unable to update password.");
        return;
      }

      setNewPassword("");
      setResetting(false);
      await onPasswordUpdated();
    } catch {
      setError("Unable to update password.");
    } finally {
      setSaving(false);
    }
  }

  if (!password) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-brown">Password not on file.</p>
        {resetting ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <PasswordInput
              id={`reset-password-${userId}`}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={12}
              required
              className="sm:max-w-xs"
              placeholder="New password"
            />
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={saving || newPassword.length < 12}
              className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-cream transition hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save password"}
            </button>
            <button
              type="button"
              onClick={() => {
                setResetting(false);
                setNewPassword("");
                setError("");
              }}
              className="text-sm text-brown hover:text-brown-dark"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setResetting(true)}
            className="text-sm font-medium text-brand hover:underline"
          >
            Set password
          </button>
        )}
        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <code className="rounded bg-brown/5 px-2 py-1 text-sm text-brown-dark">
          {visible ? password : "••••••••••••"}
        </code>
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="rounded-lg p-1.5 text-brown transition hover:bg-brown/5 hover:text-brown-dark"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOffIcon className="size-4" />
          ) : (
            <EyeIcon className="size-4" />
          )}
        </button>
      </div>

      {!resetting ? (
        <button
          type="button"
          onClick={() => setResetting(true)}
          className="text-sm text-brown hover:text-brown-dark"
        >
          Reset password
        </button>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <PasswordInput
            id={`update-password-${userId}`}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={12}
            required
            className="sm:max-w-xs"
            placeholder="New password"
          />
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={saving || newPassword.length < 12}
            className="rounded-lg bg-brand px-3 py-2 text-sm font-medium text-cream transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save password"}
          </button>
          <button
            type="button"
            onClick={() => {
              setResetting(false);
              setNewPassword("");
              setError("");
            }}
            className="text-sm text-brown hover:text-brown-dark"
          >
            Cancel
          </button>
        </div>
      )}

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
