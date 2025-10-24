import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type StoreParams = { storeId: string };

export async function PATCH(
  req: Request,
  ctx: { params: Promise<StoreParams> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { storeId } = await ctx.params;

    const body = await req.json();
    const { name } = body ?? {};
    if (!name) return new NextResponse("Store name is required", { status: 400 });
    if (!storeId) return new NextResponse("Store ID is required", { status: 400 });

    const store = await db.store.update({
      where: { id: storeId, userId },
      data: { name },
    });

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<StoreParams> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { storeId } = await ctx.params;
    if (!storeId) return new NextResponse("Store ID is required", { status: 400 });

    const result = await db.store.deleteMany({
      where: { id: storeId, userId },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
