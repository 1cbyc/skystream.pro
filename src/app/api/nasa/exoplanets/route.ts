import { NextRequest, NextResponse } from "next/server";
import { fetchExoplanets } from "@/lib/nasa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get("limit");
    const data = await fetchExoplanets(limit ? Number(limit) : undefined);
    return NextResponse.json({ status: "ok", data });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to fetch exoplanets.",
      },
      { status: 500 },
    );
  }
}
