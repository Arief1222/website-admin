import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type GetParams = { productId: string };
type MutateParams = { storeId: string; productId: string };

export async function GET(
  req: Request,
  ctx: { params: Promise<GetParams> }
) {
  try {
    const { productId } = await ctx.params;

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
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

    const { storeId, productId } = await ctx.params;

    const body = await req.json();
    const { name, price, categoryId, images, isFeatured, isArchived } = body ?? {};

    if (!name) return new NextResponse("name needs to be input", { status: 400 });
    if (!images || images.length === 0)
      return new NextResponse("image needs to be input", { status: 400 });
    if (price === undefined || price === null)
      return new NextResponse("price needs to be input", { status: 400 });
    if (!categoryId)
      return new NextResponse("category needs to be input", { status: 400 });
    if (!productId)
      return new NextResponse("Product ID is required", { status: 400 });

    const storeByUserId = await db.store.findFirst({
      where: { id: storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse("Store not found or you do not have permission", {
        status: 404,
      });
    }

    // Update fields & wipe images
    await db.product.update({
      where: { id: productId },
      data: {
        name,
        // Jika schema pakai Decimal, Prisma terima number | Decimal | string
        price,
        isFeatured,
        isArchived,
        categoryId,
        images: { deleteMany: {} },
      },
    });

    // Recreate images
    const product = await db.product.update({
      where: { id: productId },
      data: {
        images: {
          createMany: {
            data: images.map((img: { url: string }) => ({ url: img.url })),
          },
        },
      },
      include: { images: true, category: true },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
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

    const { storeId, productId } = await ctx.params;

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: { id: storeId, userId },
    });
    if (!storeByUserId) {
      return new NextResponse("Store not found or you do not have permission", {
        status: 404,
      });
    }

    const result = await db.product.deleteMany({
      where: { id: productId },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
