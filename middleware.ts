import { NextResponse, type NextRequest } from "next/server";

/** Normalize code URLs before streaming so duplicates receive an HTTP 308. */
export function middleware(request: NextRequest) {
  const match = /^(\/(?:ru\/)?(?:stations|routes)\/)([a-zA-Z0-9-]+)$/.exec(request.nextUrl.pathname);
  if (match && match[2] !== match[2].toUpperCase()) {
    const url = request.nextUrl.clone();
    url.pathname = `${match[1]}${match[2].toUpperCase()}`;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/stations/:path*", "/routes/:path*", "/ru/stations/:path*", "/ru/routes/:path*"],
};
