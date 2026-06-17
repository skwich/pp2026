import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { spawn } from "child_process";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { project_id } = await req.json();

  const project = await prisma.project.findUnique({
    where: { id: Number(project_id) },
  });

  if (!project || project.userId !== session.user.id) {
    return new Response("Not found", { status: 404 });
  }

  const username = session.user.username;

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
  if (project.shouldWarn == "true") args.push("--should-warn");

  const encoder = new TextEncoder();

  function safeEnqueue(
    controller: ReadableStreamDefaultController,
    data: string,
  ) {
    try {
      controller.enqueue(encoder.encode(data));
    } catch {}
  }

  function safeClose(controller: ReadableStreamDefaultController) {
    try {
      controller.close();
    } catch {}
  }

  const stream = new ReadableStream({
    start(controller) {
      const proc = spawn("script/.venv/bin/python", args, {
        cwd: process.cwd(),
      });

      req.signal.addEventListener("abort", () => {
        proc.kill();
        safeClose(controller);
      });

      proc.stdout.on("data", (d) => {
        const text = d.toString();
        safeEnqueue(
          controller,
          `data: ${JSON.stringify({ type: "stdout", text })}\n\n`,
        );
      });

      proc.stderr.on("data", (d) => {
        const text = d.toString();
        safeEnqueue(
          controller,
          `data: ${JSON.stringify({ type: "stderr", text })}\n\n`,
        );
      });

      proc.on("close", (exitCode) => {
        safeEnqueue(
          controller,
          `data: ${JSON.stringify({ type: "done", success: exitCode === 0, exitCode })}\n\n`,
        );
        safeClose(controller);
      });

      proc.on("error", (err) => {
        safeEnqueue(
          controller,
          `data: ${JSON.stringify({ type: "error", text: err.message })}\n\n`,
        );
        safeClose(controller);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
