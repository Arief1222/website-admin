import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type GetParams = { bannerId: string };
type MutateParams = { storeId: string; bannerId: string };

export async function GET(
  req: Request,
  ctx: { params: Promise<GetParams> }
) {
  try {
    const { bannerId } = await ctx.params;

    if (!bannerId) {
      return new NextResponse("Banner ID is required", { status: 400 });
    }

    const banner = await db.banner.findUnique({
      where: { id: bannerId },
    });

    return NextResponse.json(banner, { status: 200 });
  } catch (error) {
    console.log("[BANNER_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<MutateParams> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { storeId, bannerId } = await ctx.params;

    const body = await req.json();
    const { label, imageUrl } = body ?? {};

    if (!label) return new NextResponse("Label name is required", { status: 400 });
    if (!imageUrl) return new NextResponse("imageUrl name is required", { status: 400 });
    if (!bannerId) return new NextResponse("Banner ID is required", { status: 400 });

    const storeByUserId = await db.store.findFirst({
      where: { id: storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse("Store not found or you do not have permission", { status: 404 });
    }

    const banner = await db.banner.updateMany({
      where: { id: bannerId },
      data: { label, imageUrl },
    });

    return NextResponse.json(banner, { status: 200 });
  } catch (error) {
    console.log("[BANNER_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<MutateParams> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { storeId, bannerId } = await ctx.params;

    if (!bannerId) {
      return new NextResponse("Banner ID is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: { id: storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse("Store not found or you do not have permission", { status: 404 });
    }

    const banner = await db.banner.deleteMany({
      where: { id: bannerId },
    });

    return NextResponse.json(banner, { status: 200 });
  } catch (error) {
    console.log("[BANNER_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
