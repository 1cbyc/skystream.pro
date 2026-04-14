import { NextResponse } from "next/server";
import { buildDashboard } from "@/lib/nasa";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await buildDashboard();
    return NextResponse.json({ status: "ok", data });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to build dashboard.",
      },
      { status: 500 },
    );
  }
}
