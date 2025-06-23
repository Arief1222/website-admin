import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {

    try {



        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const products = await db.product.findUnique({
            where: {
                id: params.productId,
            },

            include: {
                images: true,
                category: true
            }

        });

        return NextResponse.json(products, { status: 200 });

    } catch (error) {
        console.log("[PRODUCT_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {

    try {

        const { userId } = await auth();
        const body = await req.json();
        const { name, price, categoryId, images, isFeatured, isArchived } = body;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!name) {
            return new NextResponse("name needs to be input", { status: 400 });
        }

        if (!images || images.length === 0) {
            return new NextResponse("image needs to be input", { status: 400 });
        }

        if (!price) {
            return new NextResponse("price needs to be input", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("category needs to be input", { status: 400 });
        }

        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
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

        await db.product.update({
            where: {
                id: params.productId,
            },
           data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                images: {
                    deleteMany: {}
                },
            },
        });

        const products = await db.product.update({
            where:{
                id: params.productId
            },

            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(products, { status: 200 });

    } catch (error) {
        console.log("[PRODUCT_PATCH]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {

    try {

        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
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

        const products = await db.product.deleteMany({
            where: {
                id: params.productId,
            },
        });

        return NextResponse.json(products, { status: 200 });

    } catch (error) {
        console.log("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}