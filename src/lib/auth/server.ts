import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { defaultSession, sessionOptions, type SessionData } from "./session";

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function requireSession() {
  const session = await getSession();

  if (!session.isLoggedIn) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function requireMasterSession() {
  const session = await requireSession();

  if (session.role !== "master") {
    throw new Error("Forbidden");
  }

  return session;
}

export async function clearSession() {
  const session = await getSession();
  session.isLoggedIn = false;
  session.username = undefined;
  session.userId = undefined;
  session.role = undefined;
  await session.save();
  return defaultSession;
}
