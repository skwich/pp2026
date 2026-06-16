import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { access } from "fs/promises";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
  });

  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filepath = path.join(
    process.cwd(),
    "userdata",
    session.user.username!,
    id,
    project.pdfName,
  );

  try {
    await access(filepath);
    return NextResponse.json({ exists: true, pdfName: project.pdfName });
  } catch {
    return NextResponse.json({ exists: false, pdfName: project.pdfName });
  }
}
