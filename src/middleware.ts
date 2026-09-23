import { unsealData } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import {
  defaultSession,
  sessionOptions,
  type SessionData,
} from "@/lib/auth/session";

async function readSession(request: NextRequest): Promise<SessionData> {
  const sealed = request.cookies.get(sessionOptions.cookieName)?.value;
  const secret = process.env.AUTH_SECRET;

  if (!sealed || !secret) {
    return defaultSession;
  }

  try {
    return await unsealData<SessionData>(sealed, {
      password: secret,
      ttl: sessionOptions.ttl,
    });
  } catch {
    return defaultSession;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const session = await readSession(request);

  if (pathname.startsWith("/dashboard/login")) {
    if (session.isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (!session.isLoggedIn) {
    const loginUrl = new URL("/dashboard/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/dashboard/users") && session.role !== "master") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
