import { NextRequest, NextResponse } from "next/server";
import { fetchEonet } from "@/lib/nasa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get("status");
    const limit = request.nextUrl.searchParams.get("limit");
    const start = request.nextUrl.searchParams.get("start") || undefined;
    const end = request.nextUrl.searchParams.get("end") || undefined;

    const data = await fetchEonet({
      status: (status as "open" | "closed" | "all") || undefined,
      limit: limit ? Number(limit) : undefined,
      start,
      end,
    });

    return NextResponse.json({ status: "ok", data });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unable to fetch events.",
      },
      { status: 500 },
    );
  }
}
