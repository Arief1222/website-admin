import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type StoreParams = { storeId: string };

export async function POST(
  req: Request,
  ctx: { params: Promise<StoreParams> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { storeId } = await ctx.params;

    const body = await req.json();
    const { label, imageUrl } = body ?? {};

    if (!label) return new NextResponse("banner needs to be input", { status: 400 });
    if (!imageUrl) return new NextResponse("imageUrl is required", { status: 400 });
    if (!storeId) return new NextResponse("Store ID is required", { status: 400 });

    const storeByUserId = await db.store.findFirst({
      where: { id: storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse("Store not found or you do not have permission", { status: 404 });
    }

    const banner = await db.banner.create({
      data: { label, imageUrl, storeId },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.log("[BANNERS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  ctx: { params: Promise<StoreParams> }
) {
  try {
    const { storeId } = await ctx.params;

    if (!storeId) return new NextResponse("Store ID is required", { status: 400 });

    const banners = await db.banner.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(banners, { status: 200 });
  } catch (error) {
    console.log("[BANNERS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
