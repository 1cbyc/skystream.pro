import { NextRequest, NextResponse } from "next/server";
import { fetchDonkiDigest } from "@/lib/nasa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const days = request.nextUrl.searchParams.get("days");
    const data = await fetchDonkiDigest(days ? Number(days) : undefined);
    return NextResponse.json({ status: "ok", data });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to fetch space weather.",
      },
      { status: 500 },
    );
  }
}
