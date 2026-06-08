import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {

    const { pathname } = request.nextUrl;

    const session = await auth.api.getSession({ headers: request.headers });

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