import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { access } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const enriched = await Promise.all(
    projects.map(async (project) => {
      const excelPath = path.join(
        process.cwd(),
        "userdata",
        session.user.username!,
        String(project.id),
        "Результат.xlsx",
      );
      let excelExists = false;
      try {
        await access(excelPath);
        excelExists = true;
      } catch {}
      return { ...project, excelExists };
    }),
  );

  return NextResponse.json(enriched);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, pdfName, excelName, description } = await req.json();
    const project = await prisma.project.create({
      data: {
        title: title ?? "Новый проект",
        pdfName: pdfName ?? "не загружен",
        excelName: excelName ?? "не сформирован",
        description: description ?? "Черновик",
        userId: session.user.id,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({error: "Internal"}, {status: 500});
  }
}
