import { NextRequest, NextResponse } from "next/server";
import { searchNasaLibrary } from "@/lib/nasa";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("query") || undefined;
    const mediaType = request.nextUrl.searchParams.get("mediaType");
    const page = request.nextUrl.searchParams.get("page");

    const data = await searchNasaLibrary({
      query,
      mediaType: (mediaType as "image" | "video" | "audio") || undefined,
      page: page ? Number(page) : undefined,
    });

    return NextResponse.json({ status: "ok", data });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to search NASA media library.",
      },
      { status: 500 },
    );
  }
}
