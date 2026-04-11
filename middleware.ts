import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = "c0nt3nt1d3a53cr3tPr0d";
const key = new TextEncoder().encode(secretKey);

const protectedRoutes = ["/dashboard", "/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const sessionCookie = request.cookies.get("auth_session")?.value;
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const { payload } = await jwtVerify(sessionCookie, key, { algorithms: ["HS256"] });
      const role = (payload.user as any)?.role;

      if (pathname.startsWith("/admin") && role !== "Admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  
  // Prevent logged in users from visiting login again
  if (pathname === "/login") {
      const sessionCookie = request.cookies.get("auth_session")?.value;
      if (sessionCookie) {
          try {
            await jwtVerify(sessionCookie, key, { algorithms: ["HS256"] });
            return NextResponse.redirect(new URL("/dashboard", request.url));
          } catch(e) {}
      }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};