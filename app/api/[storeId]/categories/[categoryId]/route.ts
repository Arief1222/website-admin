import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type GetParams = { categoryId: string };
type MutateParams = { storeId: string; categoryId: string };

export async function GET(
  req: Request,
  ctx: { params: Promise<GetParams> }
) {
  try {
    const { categoryId } = await ctx.params;

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: { banner: true },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
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

    const { storeId, categoryId } = await ctx.params;

    const body = await req.json();
    const { name, bannerId } = body ?? {};

    if (!name) return new NextResponse("Category name is required", { status: 400 });
    if (!bannerId) return new NextResponse("BannerId name is required", { status: 400 });
    if (!categoryId) return new NextResponse("Category ID is required", { status: 400 });

    const storeByUserId = await db.store.findFirst({
      where: { id: storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse("Store not found or you do not have permission", { status: 404 });
    }

    const category = await db.category.updateMany({
      where: { id: categoryId },
      data: { name, bannerId },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log("[CATEGORIES_PATCH]", error);
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

    const { storeId, categoryId } = await ctx.params;

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: { id: storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse("Store not found or you do not have permission", { status: 404 });
    }

    const category = await db.category.deleteMany({
      where: { id: categoryId },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log("[CATEGORIES_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
