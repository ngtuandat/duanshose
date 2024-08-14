import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt_decode from "jwt-decode";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.getAll();
  console.log({ cookie });
  const { pathname } = request.nextUrl;

  if (cookie.length > 0) {
    const token = cookie.map((item) => item.value);
    const decoded: any = jwt_decode(token.toString());

    if (pathname.startsWith("/dashboard") && decoded.admin === false) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/sign-in") && decoded) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/sign-up") && decoded) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // if (pathname.startsWith("/checkout")) {
    //   return NextResponse.redirect(new URL("/sign-in", request.url));
    // }
    if (pathname.startsWith("/user/profile")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    // if (pathname.startsWith("/user/purchase")) {
    //   return NextResponse.redirect(new URL("/sign-in", request.url));
    // }
  }
}
