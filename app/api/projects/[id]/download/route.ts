import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { readFile } from "fs/promises";

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

  const username = session.user.username;
  const text = `Результат проекта "${project.title}" (ID: ${project.id})`;

  const filepath = await new Promise<string>((resolve, reject) => {
    const proc = spawn("python3", ["scripts/generate.py", username], {
      cwd: process.cwd(),
    });

    let stdout = "";
    proc.stdout.on("data", (data) => {
      stdout += data;
    });
    proc.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    proc.on("close", (code) => {
      if (code !== 0) reject(new Error("Python script failed"));
      else resolve(stdout.trim());
    });

    proc.on("error", reject);
    proc.stdin.write(text);
    proc.stdin.end();
  });

  const buffer = await readFile(filepath, "utf-8");

  return new Response(buffer, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="result.txt"',
    },
  });
}
