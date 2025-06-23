import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { categoryId: string } }
) {

    try {



        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        const categories = await db.category.findUnique({
            where: {
                id: params.categoryId,
            },

            include: {
                banner:true
            }

        });

        return NextResponse.json(categories, { status: 200 });

    } catch (error) {
        console.log("[CATEGORIES_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {

    try {

        const { userId } = await auth();
        const body = await req.json();
        const { name, bannerId } = body;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!name) {
            return new NextResponse("Category name is required", { status: 400 });
        }
        if (!bannerId) {
            return new NextResponse("BannerId name is required", { status: 400 });
        }


        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Store not found or you do not have permission", { status: 404 });
        }

        const category = await db.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                bannerId,
            },
        });

        return NextResponse.json(category, { status: 200 });

    } catch (error) {
        console.log("[CATEGORIES_PATCH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } }
) {

    try {

        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Store not found or you do not have permission", { status: 404 });
        }

        const category = await db.category.deleteMany({
            where: {
                id: params.categoryId,
            },

        });

        return NextResponse.json(category, { status: 200 });

    } catch (error) {
        console.log("[CATEGORIES_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}