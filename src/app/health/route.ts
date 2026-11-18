import { execSync } from "node:child_process";
import { connection } from "next/server";

function runningSha() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA;
  }
  if (process.env.CONTROL_SHA) return process.env.CONTROL_SHA;

  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

export async function GET() {
  await connection();

  const sha = runningSha();

  return Response.json(
    { ok: true, sha },
    { headers: { "cache-control": "no-store" } },
  );
}
