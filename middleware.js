import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { validateUserTokenLogic } from "./lib/functions";

const PUBLIC_APIS = [
  "/api/advisor-scheme-category",
  "/api/advisor-scheme-category-funds",
  "/api/amc-category",
  "/api/amc-logos",
  "/api/app-links",
  "/api/app-redirect",
  "/api/bot",
  "/api/book",
  "/api/allCalculators",
  "/api/compare-funds",
  "/api/email",
  "/api/leads",
  "/api/financialhealthuser",
  "/api/forget-password",
  "/api/forgot-password",
  "/api/research-calculator",
  "/api/reset-password",
  "/api/open-apis",
  "/api/riskcalculator",
  "/api/submit-forget-password",
  "/api/login",
  "/api/financialhealth",
  "/api/calculators",
  "/api/subscription",
  "/api/risk-questions",
  "/api/uploads",
  "/api/verify-old-password",
  "/api/generate-pdf",
  "/api/submit-forget-password-otp",
  "/api/permissions",
  "/api/robo",
  "/api/robomodel",
  "/api/verify-otp",
  "/api/user",
  "/api/auth",
  "/api/theme",
  "/api/site-logo",
];

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const method = req.method.toUpperCase();
  const isProduction = process.env.NODE_ENV === "production";

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";

  // Force HTTPS in production
  if (isProduction && proto !== "https") {
    return NextResponse.redirect(`${proto}://${host}${pathname}`);
  }

  // Get token from NextAuth
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if the route is public
  const isPublicApi = PUBLIC_APIS.some(
    (publicPath) =>
      pathname === publicPath || pathname.startsWith(`${publicPath}/`),
  );

  // Only validate tokenVersion for protected routes
  if (!isPublicApi && token?.id && token?.deviceId) {
    try {
      const data = await validateUserTokenLogic({
        id: token.id,
        deviceId: token.deviceId,
        tokenVersion: token.tokenVersion,
      });

      if (!data.valid) {
        // Token invalid or expired   redirect to signin
        return NextResponse.redirect(`${proto}://${host}/signin`);
      }
    } catch (err) {
      console.error("Middleware validate token error:", err);
      return NextResponse.redirect(`${proto}://${host}/signin`);
    }
  }

  // DEVADMIN protection
  if (
    pathname.startsWith("/devadmin") &&
    (!token || token.role !== "DEVADMIN")
  ) {
    return NextResponse.redirect(`${proto}://${host}/signin`);
  }

  // ADMIN protection
  if (
    pathname.startsWith("/admin") &&
    (!token || !["ADMIN", "DEVADMIN"].includes(token.role))
  ) {
    return NextResponse.redirect(`${proto}://${host}/signin`);
  }

  // Redirect logged-in user away from /signin
  if (pathname === "/signin" && token) {
    const redirectPath =
      token.role === "DEVADMIN"
        ? "/devadmin"
        : token.role === "ADMIN"
          ? "/admin"
          : "/";
    return NextResponse.redirect(`${proto}://${host}${redirectPath}`);
  }

  // API protection for write methods
  if (pathname.startsWith("/api")) {
    const writeMethods = ["POST", "PUT", "PATCH"];
    if (writeMethods.includes(method) && !isPublicApi && !token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/devadmin/:path*", "/signin"],
  runtime: "nodejs",
};
