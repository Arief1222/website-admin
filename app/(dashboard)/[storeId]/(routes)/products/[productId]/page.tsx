import db from "@/lib/db";
import { ProductForm } from "./components/product-form";

type Params = { storeId: string; productId: string };

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { storeId, productId } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id: productId },
      include: { images: true },
    }),
    db.category.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product} categories={categories} />
      </div>
    </div>
  );
}
