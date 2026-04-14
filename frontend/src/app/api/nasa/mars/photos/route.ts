import { NextRequest, NextResponse } from "next/server";
import { fetchMarsPhotos } from "@/lib/nasa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const rover = request.nextUrl.searchParams.get("rover") || undefined;
    const solParam = request.nextUrl.searchParams.get("sol");
    const pageParam = request.nextUrl.searchParams.get("page");
    const camera = request.nextUrl.searchParams.get("camera") || undefined;

    const data = await fetchMarsPhotos({
      rover,
      sol: solParam ? Number(solParam) : undefined,
      page: pageParam ? Number(pageParam) : undefined,
      camera,
    });

    return NextResponse.json({ status: "ok", data });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to fetch Mars photos.",
      },
      { status: 500 },
    );
  }
}
