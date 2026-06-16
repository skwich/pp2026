import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.username) {
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
    session.user.username,
    id,
    "Результат.xlsx",
  );

  try {
    const buffer = await readFile(filepath);
    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent("Результат.xlsx")}`,
      },
    });
  } catch (err) {
    console.error(`[download] filepath: ${filepath}`, err);
    return NextResponse.json(
      { error: "Excel-файл ещё не сформирован" },
      { status: 404 },
    );
  }
}
