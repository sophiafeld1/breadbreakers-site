import type { SessionOptions } from "iron-session";

export type SessionRole = "master" | "user";

export type SessionData = {
  isLoggedIn: boolean;
  username?: string;
  userId?: string;
  role?: SessionRole;
};

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.AUTH_SECRET ?? "",
  cookieName: "bb-dashboard-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};
