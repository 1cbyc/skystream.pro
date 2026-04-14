import { NextRequest, NextResponse } from "next/server";
import { fetchApod } from "@/lib/nasa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date") || undefined;
    const data = await fetchApod(date);
    return NextResponse.json({ status: "ok", data });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unable to fetch APOD.",
      },
      { status: 500 },
    );
  }
}
