import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { rm } from "fs/promises";
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

  return NextResponse.json(project);
}

export async function PATCH(
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

  const body = await req.json();
  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.floors !== undefined) data.floors = body.floors;
  if (body.rawHeaders !== undefined) data.rawHeaders = body.rawHeaders;
  if (body.breakWords !== undefined) data.breakWords = body.breakWords;
  if (body.maxIndex !== undefined) data.maxIndex = body.maxIndex;
  if (body.maxDistSnap !== undefined) data.maxDistSnap = body.maxDistSnap;
  if (body.maxDistStop !== undefined) data.maxDistStop = body.maxDistStop;
  if (body.minFont !== undefined) data.minFont = body.minFont;
  if (body.shouldWarn !== undefined) data.shouldWarn = body.shouldWarn;
  if (body.excelName !== undefined) {
    data.excelName = body.excelName;
    if (body.excelName === "Результат.xlsx") {
      data.excelGeneratedAt = new Date();
    }
  }

  const updated = await prisma.project.update({
    where: { id: Number(id) },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
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

  await prisma.project.delete({ where: { id: Number(id) } });

  const userdataDir = path.join(
    process.cwd(),
    "userdata",
    session.user.username!,
    id,
  );
  await rm(userdataDir, { recursive: true, force: true });

  return NextResponse.json({ success: true });
}
