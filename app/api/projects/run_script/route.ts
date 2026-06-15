import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { spawn } from "child_process";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { project_id, floors } = await req.json();

  const project = await prisma.project.findUnique({
    where: { id: Number(project_id) },
  });

  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const username = session.user.username || "unknown";
  const pdfName = project.pdfName;

  const proc = spawn("python3", [
    "script/main.py",
    floors,
    username,
    project_id,
    pdfName,
  ], { cwd: process.cwd() });

  let stdout = "";
  let stderr = "";
  proc.stdout.on("data", (d) => { stdout += d; });
  proc.stderr.on("data", (d) => { stderr += d; });

  const exitCode = await new Promise<number>((resolve) => {
    proc.on("close", resolve);
    proc.on("error", () => resolve(1));
  });

  return NextResponse.json({
    success: exitCode === 0,
    exitCode,
    stdout,
    stderr,
  });
}