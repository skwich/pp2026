import { getCookieCache } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {

    const { pathname } = request.nextUrl;

    const session = await getCookieCache(request);

    const mainPages = [
        "/my-projects",
    ]
    if (mainPages.some((p) => pathname.startsWith(p)) && !session) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const authPages = [
        "/sign-in",
        "/sign-up",
    ]
    if (session && authPages.some((p) => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL("/my-projects", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/sign-in", "/sign-up", "/my-projects"]
};