import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Pinged daily by the Vercel cron in vercel.json so Supabase's free tier never
// sees a week of inactivity and pauses the project. Also usable by an uptime
// monitor: 503 means the database is unreachable.
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[health] database unreachable:", err);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
