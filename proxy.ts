import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getRedirectPathForRole } from "@/lib/auth/redirects";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isLoggedIn = !!token;
  const role = token?.role as "FREELANCER" | "CLIENT" | "ADMIN" | undefined;
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");
  const isDashboardPage = req.nextUrl.pathname.startsWith("/dashboard");
  const isClientPage = req.nextUrl.pathname.startsWith("/client");
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
  const isSettingsPage = req.nextUrl.pathname.startsWith("/settings");
  const isProjectsPage = req.nextUrl.pathname.startsWith("/projects");
  const isMessagesPage = req.nextUrl.pathname.startsWith("/messages");
  const isFreelancerAiPage = req.nextUrl.pathname === "/ai-assistant";

  const isProtectedRoute =
    isDashboardPage ||
    isClientPage ||
    isAdminPage ||
    isSettingsPage ||
    isProjectsPage ||
    isMessagesPage ||
    isFreelancerAiPage ||
    req.nextUrl.pathname.startsWith("/client/ai-assistant");

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(
      new URL(getRedirectPathForRole(role), req.url),
    );
  }

  // Protect protected routes
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based route protection
  if (isLoggedIn) {
    if (isDashboardPage && role !== "FREELANCER") {
      return NextResponse.redirect(
        new URL(getRedirectPathForRole(role), req.url),
      );
    }
    if (isClientPage && role !== "CLIENT") {
      return NextResponse.redirect(
        new URL(getRedirectPathForRole(role), req.url),
      );
    }
    if (isAdminPage && role !== "ADMIN") {
      return NextResponse.redirect(
        new URL(getRedirectPathForRole(role), req.url),
      );
    }
    if (isFreelancerAiPage && role !== "FREELANCER") {
      return NextResponse.redirect(
        new URL(getRedirectPathForRole(role), req.url),
      );
    }
  }

  // Check if account is disabled (do not trust old JWT)
  if (isLoggedIn && isProtectedRoute) {
    try {
      const statusRes = await fetch(new URL("/api/auth/status", req.url), {
        headers: { cookie: req.headers.get("cookie") || "" },
      });
      if (statusRes.ok) {
        const { isDisabled } = await statusRes.json();
        if (isDisabled) {
          const response = NextResponse.redirect(new URL("/", req.url));
          response.cookies.delete("authjs.session-token");
          response.cookies.delete("__Secure-authjs.session-token");
          return response;
        }
      }
    } catch (e) {
      // Ignore fetch errors, fallback to allowing request
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
