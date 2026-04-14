import { NextRequest, NextResponse } from "next/server";
import { fetchMarsManifest } from "@/lib/nasa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const rover = request.nextUrl.searchParams.get("rover") || "curiosity";
    const data = await fetchMarsManifest(rover);
    return NextResponse.json({ status: "ok", data });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to fetch rover manifest.",
      },
      { status: 500 },
    );
  }
}
