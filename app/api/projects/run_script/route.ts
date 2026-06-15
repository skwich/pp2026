import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { spawn } from "child_process";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { project_id } = await req.json();

  const project = await prisma.project.findUnique({
    where: { id: Number(project_id) },
  });

  if (!project || project.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const username = session.user.username;

  console.log(`
    floors: ${project.floors}
    username: ${username}
    project_id: ${project_id}
    pdf_name: ${project.pdfName}
    `);

  const args: string[] = [
    "script/main.py",
    project.floors ?? "",
    username,
    project_id,
    project.pdfName,
  ];
  if (project.rawHeaders) args.push("--raw-headers", project.rawHeaders);
  if (project.breakWords) args.push("--break-words", project.breakWords);
  if (project.maxIndex) args.push("--max-index", project.maxIndex);
  if (project.maxDistSnap) args.push("--max-dist-snap", project.maxDistSnap);
  if (project.maxDistStop) args.push("--max-dist-stop", project.maxDistStop);
  if (project.minFont) args.push("--min-font", project.minFont);
  if (project.shouldWarn) args.push("--should-warn", project.shouldWarn);

  const proc = spawn("script/.venv/bin/python", args, { cwd: process.cwd() });

  let stdout = "";
  let stderr = "";
  proc.stdout.on("data", (d) => {
    const text = d.toString();
    stdout += text;
    console.log(`[PYTHON STDOUT]: ${text.trim()}`);
  });
  proc.stderr.on("data", (d) => {
    const text = d.toString();
    stderr += text;
    console.error(`[PYTHON STDERR]: ${text.trim()}`);
  });

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
