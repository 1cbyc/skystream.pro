import { NextRequest, NextResponse } from "next/server";
import { buildCapsule } from "@/lib/nasa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const date =
      request.nextUrl.searchParams.get("date") ||
      new Date().toISOString().slice(0, 10);
    const data = await buildCapsule(date);
    return NextResponse.json({ status: "ok", data });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unable to build capsule.",
      },
      { status: 500 },
    );
  }
}
