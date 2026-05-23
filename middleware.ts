import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/shop", "/cart", "/checkout", "/account"];
const subscriptionRequiredRoutes = ["/shop", "/cart", "/checkout"];
const authRoutes = ["/auth/login", "/auth/register"];

export default auth(async function middleware(req: NextRequest & { auth?: { user?: { id?: string; subscriptionStatus?: string } } | null }) {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isSubscriptionRequired = subscriptionRequiredRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && session?.user) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect unauthenticated users to login for protected routes
  if (isProtectedRoute && !session?.user) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check subscription for subscription-required routes
  if (isSubscriptionRequired && session?.user) {
    const subscriptionStatus = session.user.subscriptionStatus;

    if (subscriptionStatus !== "active") {
      return NextResponse.redirect(new URL("/subscribe", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)",
  ],
};
