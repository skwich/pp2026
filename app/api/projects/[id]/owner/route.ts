import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params}: {params: Promise<{id: string}>}) {
    const session = await auth.api.getSession({headers: req.headers});
    if (!session?.user?.id) {
        return NextResponse.json({isOwner: false});
    }

    const {id} = await params;
    const project = await prisma.project.findUnique({
        where: {id: Number(id)},
        select: {userId: true}
    });

    return NextResponse.json({
        isOwner: project?.userId === session.user.id
    });
}