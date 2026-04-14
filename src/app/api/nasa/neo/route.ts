import { NextRequest, NextResponse } from "next/server";
import { fetchNeoFeed } from "@/lib/nasa";

export const dynamic = "force-dynamic";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  try {
    const startDate = request.nextUrl.searchParams.get("startDate") || today();
    const endDate = request.nextUrl.searchParams.get("endDate") || startDate;
    const data = await fetchNeoFeed(startDate, endDate);
    return NextResponse.json({ status: "ok", data });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unable to fetch NEO feed.",
      },
      { status: 500 },
    );
  }
}
