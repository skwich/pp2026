import { getCookieCache } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {

    const { pathname } = request.nextUrl;

    const session = await getCookieCache(request);

    if (pathname.startsWith("/main") && !session) {
        return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    if (session && pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/main/myprojects", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/auth:path*", "/main:path*"]
};