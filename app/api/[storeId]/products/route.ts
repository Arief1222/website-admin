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
    const { name, price, categoryId, images, isFeatured, isArchived } = body ?? {};

    if (!name) return new NextResponse("name needs to be input", { status: 400 });
    if (!images || images.length === 0)
      return new NextResponse("image needs to be input", { status: 400 });
    // Hindari check falsy agar 0 tidak dianggap missing
    if (price === undefined || price === null)
      return new NextResponse("price needs to be input", { status: 400 });
    if (!categoryId)
      return new NextResponse("category needs to be input", { status: 400 });
    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const storeByUserId = await db.store.findFirst({
      where: { id: storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse("Store not found or you do not have permission", {
        status: 404,
      });
    }

    const product = await db.product.create({
      data: {
        name,
        // Jika schema Prisma pakai Decimal, nilai number tetap valid
        price,
        categoryId,
        isFeatured,
        isArchived,
        storeId,
        images: {
          createMany: {
            data: images.map((img: { url: string }) => ({ url: img.url })),
          },
        },
      },
      include: { images: true, category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  ctx: { params: Promise<StoreParams> }
) {
  try {
    const { storeId } = await ctx.params;

    if (!storeId) return new NextResponse("Store ID URL is required", { status: 400 });

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    const products = await db.product.findMany({
      where: {
        storeId,
        categoryId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
