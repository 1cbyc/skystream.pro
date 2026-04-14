import { NextRequest, NextResponse } from "next/server";
import { fetchEpic } from "@/lib/nasa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get("limit");
    const data = await fetchEpic(limitParam ? Number(limitParam) : undefined);
    return NextResponse.json({ status: "ok", data });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unable to fetch EPIC.",
      },
      { status: 500 },
    );
  }
}
