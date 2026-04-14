import { NextRequest, NextResponse } from "next/server";
import { fetchEarthAssets } from "@/lib/nasa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const lat = request.nextUrl.searchParams.get("lat");
    const lon = request.nextUrl.searchParams.get("lon");
    const date = request.nextUrl.searchParams.get("date") || undefined;
    const dim = request.nextUrl.searchParams.get("dim");

    const data = await fetchEarthAssets({
      lat: lat ? Number(lat) : undefined,
      lon: lon ? Number(lon) : undefined,
      date,
      dim: dim ? Number(dim) : undefined,
    });

    return NextResponse.json({ status: "ok", data });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to fetch Earth imagery.",
      },
      { status: 500 },
    );
  }
}
