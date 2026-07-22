import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRedirectPathForRole } from "@/lib/auth/redirects";

export const proxy = auth(async (req) => {
  // In Auth.js v5, req.auth contains your session object!
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role as "FREELANCER" | "CLIENT" | "ADMIN" | undefined;
  
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
    return NextResponse.redirect(new URL(getRedirectPathForRole(role), req.url));
  }

  // Protect protected routes
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based route protection
  if (isLoggedIn) {
    if (isDashboardPage && role !== "FREELANCER") {
      return NextResponse.redirect(new URL(getRedirectPathForRole(role), req.url));
    }
    if (isClientPage && role !== "CLIENT") {
      return NextResponse.redirect(new URL(getRedirectPathForRole(role), req.url));
    }
    if (isAdminPage && role !== "ADMIN") {
      return NextResponse.redirect(new URL(getRedirectPathForRole(role), req.url));
    }
    if (isFreelancerAiPage && role !== "FREELANCER") {
      return NextResponse.redirect(new URL(getRedirectPathForRole(role), req.url));
    }
  }

  // NOTE: Remove the fetch to /api/auth/status from middleware. 
  // If you need to check if an account is disabled on every request, 
  // you should do that inside the `callbacks.authorized` or `callbacks.jwt` in auth.config.ts, 
  // where you have direct database access via the Node runtime, not Edge middleware!

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
