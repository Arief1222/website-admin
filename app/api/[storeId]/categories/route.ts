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
    const { name, bannerId } = body ?? {};

    if (!name) return new NextResponse("Category name needs to be input", { status: 400 });
    if (!bannerId) return new NextResponse("banner ID needs to be input", { status: 400 });
    if (!storeId) return new NextResponse("Store ID is required", { status: 400 });

    const storeByUserId = await db.store.findFirst({
      where: { id: storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse("Store not found or you do not have permission", { status: 404 });
    }

    const category = await db.category.create({
      data: { name, bannerId, storeId },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
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

    const categories = await db.category.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      include: { banner: true }, // opsional: hapus kalau tidak dibutuhkan
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
